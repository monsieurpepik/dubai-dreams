import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { budget, locations, goal, risk, propertyTypes } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableKey) throw new Error("LOVABLE_API_KEY not configured");

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch properties with filters
    let query = supabase
      .from("properties")
      .select(`
        id, name, slug, area, location, price_from, price_to, 
        roi_estimate, completion_date, bedrooms, property_type,
        size_sqft_from, size_sqft_to, construction_percent, status,
        payment_plan, golden_visa_eligible, tagline,
        developer:developers(name, slug, logo_url),
        property_images(url, is_primary, display_order)
      `)
      .gte("price_from", budget?.[0] || 500000)
      .order("created_at", { ascending: false })
      .limit(50);

    if (budget?.[1]) {
      query = query.lte("price_from", budget[1]);
    }
    if (locations?.length > 0) {
      query = query.in("area", locations);
    }
    if (propertyTypes?.length > 0) {
      query = query.in("property_type", propertyTypes);
    }

    const [propertiesResult, marketDataResult] = await Promise.all([
      query,
      supabase.from("area_market_data").select("*"),
    ]);

    if (propertiesResult.error) throw propertiesResult.error;
    if (marketDataResult.error) throw marketDataResult.error;

    const properties = propertiesResult.data || [];
    const marketData = marketDataResult.data || [];

    if (properties.length === 0) {
      return new Response(JSON.stringify({ results: [], message: "No properties match your criteria" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build market data lookup
    const marketMap: Record<string, any> = {};
    for (const md of marketData) {
      marketMap[md.area] = md;
    }

    // Enrich properties with market context
    const enriched = properties.map((p: any) => {
      const areaData = marketMap[p.area];
      const avgPriceSqft = areaData?.avg_price_sqft || null;
      const trendPct = areaData?.trend_percentage || 0;
      const trend12m = areaData?.trend_12m || "stable";
      const fairValue = avgPriceSqft && p.size_sqft_from
        ? Math.round(avgPriceSqft * p.size_sqft_from)
        : null;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        area: p.area,
        price_from: p.price_from,
        price_to: p.price_to,
        roi_estimate: p.roi_estimate,
        completion_date: p.completion_date,
        property_type: p.property_type,
        size_sqft_from: p.size_sqft_from,
        size_sqft_to: p.size_sqft_to,
        construction_percent: p.construction_percent,
        payment_plan: p.payment_plan,
        golden_visa_eligible: p.golden_visa_eligible,
        tagline: p.tagline,
        developer_name: p.developer?.name || "Unknown",
        developer_slug: p.developer?.slug,
        developer_logo: p.developer?.logo_url,
        primary_image: [...(p.property_images || [])]
          .sort((a: any, b: any) => (a.is_primary ? -1 : b.is_primary ? 1 : (a.display_order || 0) - (b.display_order || 0)))[0]?.url || null,
        area_avg_price_sqft: avgPriceSqft,
        area_trend_pct: trendPct,
        area_trend_12m: trend12m,
        fair_value_estimate: fairValue,
      };
    });

    // Use AI to score properties
    const scoringPrompt = `You are a Dubai real estate investment analyst. Score these properties for an investor with this profile:
- Budget: AED ${budget[0]?.toLocaleString()} - AED ${budget[1]?.toLocaleString()}
- Preferred locations: ${locations?.join(", ") || "Any"}
- Goal: ${goal}
- Risk tolerance: ${risk}
- Property types: ${propertyTypes?.join(", ") || "Any"}

Properties to score:
${enriched.map((p: any, i: number) => `
[${i}] ${p.name} in ${p.area}
  Price: AED ${p.price_from?.toLocaleString()}
  ROI estimate: ${p.roi_estimate || "N/A"}%
  Fair value estimate: ${p.fair_value_estimate ? `AED ${p.fair_value_estimate.toLocaleString()}` : "N/A"}
  Area trend: ${p.area_trend_12m} (${p.area_trend_pct > 0 ? "+" : ""}${p.area_trend_pct}%)
  Completion: ${p.completion_date || "TBA"}
  Type: ${p.property_type}
`).join("")}

Score each property and call the score_properties function.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert Dubai real estate investment analyst. Always use the provided tool to return structured scores." },
          { role: "user", content: scoringPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "score_properties",
              description: "Return investment scores for each property",
              parameters: {
                type: "object",
                properties: {
                  scores: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        index: { type: "number", description: "Property index from the list" },
                        deal_score: { type: "number", description: "Overall deal score 0-100" },
                        yield_estimate: { type: "number", description: "Estimated rental yield percentage" },
                        liquidity_score: { type: "number", description: "Liquidity score 0-100" },
                        verdict: { type: "string", enum: ["Undervalued", "Fair Price", "Premium"] },
                        insight: { type: "string", description: "One-line investment insight" },
                      },
                      required: ["index", "deal_score", "yield_estimate", "liquidity_score", "verdict", "insight"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["scores"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "score_properties" } },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "AI rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI error:", aiResponse.status, await aiResponse.text());
      // Fall back to rule-based scoring
      return new Response(JSON.stringify({
        results: enriched.map((p: any) => ({
          ...p,
          deal_score: Math.min(100, Math.max(0, 50 + (p.roi_estimate || 0) * 3 + p.area_trend_pct)),
          yield_estimate: p.roi_estimate || 5,
          liquidity_score: Math.min(100, 50 + p.area_trend_pct * 2),
          verdict: p.fair_value_estimate && p.price_from < p.fair_value_estimate * 0.95 ? "Undervalued" : p.fair_value_estimate && p.price_from > p.fair_value_estimate * 1.05 ? "Premium" : "Fair Price",
          insight: "Score based on market data analysis",
        })).sort((a: any, b: any) => b.deal_score - a.deal_score).slice(0, 12),
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    let scores: any[] = [];

    // Extract tool call results
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        scores = parsed.scores || [];
      } catch (e) {
        console.error("Failed to parse AI scores:", e);
      }
    }

    // Merge scores with property data
    const results = enriched.map((p: any, i: number) => {
      const score = scores.find((s: any) => s.index === i);
      return {
        ...p,
        deal_score: score?.deal_score ?? 50,
        yield_estimate: score?.yield_estimate ?? (p.roi_estimate || 5),
        liquidity_score: score?.liquidity_score ?? 50,
        verdict: score?.verdict ?? "Fair Price",
        insight: score?.insight ?? "Analysis pending",
      };
    });

    // Sort by deal score descending
    results.sort((a: any, b: any) => b.deal_score - a.deal_score);

    return new Response(JSON.stringify({ results: results.slice(0, 12) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("match-deals error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
