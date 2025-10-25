import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint to list available models
app.get('/api/test-models', async (req, res) => {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// API route - direct implementation
app.post('/api/analyze-product', async (req, res) => {
  // Allow basic CORS for browser calls
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productData, type } = req.body || {};
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured on the server' });
    }

    const systemPrompt = `You are an expert sustainability analyst. Analyze products and provide:
1. Eco Score (A-F) based on:
   - Materials & Components (1-100)
   - Packaging Sustainability (1-100)
   - Manufacturing & Transport Impact (1-100)
   - Chemical Safety (1-100)
   - Corporate Transparency (1-100)

2. Estimated carbon footprint (in kg CO2e)
3. Comparison (e.g., "equivalent to driving X miles")
4. A brief insight about environmental concerns
5. 2-3 sustainable alternatives with:
   - Product name
   - Estimated price range
   - Eco Score
   - Carbon savings percentage

Return your analysis as JSON with this structure:
{
  "ecoScore": {
    "overall": "A-F",
    "materials": 1-100,
    "packaging": 1-100,
    "manufacturing": 1-100,
    "chemicals": 1-100,
    "transparency": 1-100
  },
  "carbonFootprint": "X.X kg CO₂e",
  "carbonComparison": "equivalent to...",
  "insight": "Brief environmental analysis...",
  "alternatives": [
    {
      "name": "...",
      "priceRange": "$X-Y",
      "ecoScore": "A-F",
      "carbonSavings": "X%"
    }
  ]
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nAnalyze this product: ${JSON.stringify(productData)}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('AI Gateway error', response.status, text);
      if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }
      if (response.status === 402) {
        return res.status(402).json({ error: 'AI credits depleted' });
      }
      return res.status(502).json({ error: 'AI Gateway error', details: text });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ?? data;

    // Try to parse JSON out of the AI text response
    let analysis = null;
    if (typeof aiResponse === 'string') {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysis = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.warn('Failed to parse AI JSON response, returning raw text');
        }
      }
    } else if (typeof aiResponse === 'object') {
      analysis = aiResponse;
    }

    return res.status(200).json({ success: true, analysis: analysis ?? aiResponse });
  } catch (error) {
    console.error('Error in analyze-product:', error);
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/analyze-product`);
  console.log(`🔑 Using GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Found' : '❌ Missing'}`);
});