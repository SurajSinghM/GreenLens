import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple Vercel Serverless Function to call Google Gemini API directly.
// It reads the server-side secret GEMINI_API_KEY from process.env (do NOT prefix with VITE_)

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const systemPrompt = `You are an expert sustainability analyst. Analyze products and provide:\n1. Eco Score (A-F) based on:\n   - Materials & Components (1-100)\n   - Packaging Sustainability (1-100)\n   - Manufacturing & Transport Impact (1-100)\n   - Chemical Safety (1-100)\n   - Corporate Transparency (1-100)\n\n2. Estimated carbon footprint (in kg CO2e)\n3. Comparison (e.g., "equivalent to driving X miles")\n4. A brief insight about environmental concerns\n5. 2-3 sustainable alternatives with:\n   - Product name\n   - Estimated price range\n   - Eco Score\n   - Carbon savings percentage\n\nReturn your analysis as JSON with this structure:\n{\n  "ecoScore": {\n    "overall": "A-F",\n    "materials": 1-100,\n    "packaging": 1-100,\n    "manufacturing": 1-100,\n    "chemicals": 1-100,\n    "transparency": 1-100\n  },\n  "carbonFootprint": "X.X kg CO₂e",\n  "carbonComparison": "equivalent to...",\n  "insight": "Brief environmental analysis...",\n  "alternatives": [\n    {\n      "name": "...",\n      "priceRange": "$X-Y",\n      "ecoScore": "A-F",\n      "carbonSavings": "X%"\n    }\n  ]\n}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
    console.error('Error in analyze-product (vercel):', error);
    return res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
  }
}
