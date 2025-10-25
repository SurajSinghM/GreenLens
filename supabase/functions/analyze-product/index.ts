import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productData, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Analyzing product:", productData);

    // Build system prompt for sustainability analysis
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

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Analyze this product: ${JSON.stringify(productData)}`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log("AI Response:", aiResponse);

    // Parse JSON from AI response
    let analysis;
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Return a fallback response
      analysis = {
        ecoScore: {
          overall: "C",
          materials: 65,
          packaging: 60,
          manufacturing: 70,
          chemicals: 65,
          transparency: 55,
        },
        carbonFootprint: "2.0 kg CO₂e",
        carbonComparison: "equivalent to driving 5 miles",
        insight: "Analysis in progress. Product sustainability factors are being evaluated.",
        alternatives: [],
      };
    }

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-product:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
