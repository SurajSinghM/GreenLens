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

// Chat endpoint
app.post('/api/chat', async (req, res) => {
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
    const { message, conversationHistory } = req.body || {};
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured on the server' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation context
    const systemPrompt = `You are Leaf, an AI-powered sustainability assistant for GreenLens. You help users make eco-friendly choices by:

1. Providing sustainability advice and tips
2. Explaining environmental concepts in simple terms
3. Suggesting eco-friendly alternatives to products
4. Helping users understand carbon footprints and eco-scores
5. Answering questions about sustainable living

Keep responses helpful, friendly, and focused on environmental topics. If asked about non-environmental topics, politely redirect to sustainability-related advice.`;

    // Convert conversation history to Gemini format
    const messages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'I understand! I\'m Leaf, your sustainability assistant. I\'m here to help you make eco-friendly choices and understand environmental impact. How can I help you today?' }] }
    ];

    // Add recent conversation history (last 10 messages to avoid token limits)
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      if (msg.role === 'user') {
        messages.push({ role: 'user', parts: [{ text: msg.content }] });
      } else if (msg.role === 'assistant') {
        messages.push({ role: 'model', parts: [{ text: msg.content }] });
      }
    }

    // Add current message
    messages.push({ role: 'user', parts: [{ text: message }] });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Chat API error', response.status, text);
      return res.status(502).json({ error: 'AI service error', details: text });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response. Please try again.";

    return res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
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

    const systemPrompt = `Analyze this product for sustainability. Return ONLY valid JSON with this exact structure:

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
  "carbonComparison": "equivalent to driving X miles",
  "insight": "Brief environmental analysis",
  "alternatives": [
    {
      "name": "Product name",
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
          maxOutputTokens: 4096,
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
    console.log('Raw Gemini response:', JSON.stringify(data, null, 2)); // Debug log
    
    // Check if we got a valid response
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from AI model');
    }
    
    const candidate = data.candidates[0];
    if (candidate.finishReason === 'MAX_TOKENS') {
      console.warn('Response truncated due to token limit');
    }
    
    const aiResponse = candidate?.content?.parts?.[0]?.text;
    
    if (!aiResponse) {
      throw new Error('No text content in AI response');
    }

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