import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per window
const RATE_WINDOW_MS = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Authenticate: require Supabase anon key
  const apikey = req.headers.get("apikey");
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  if (!apikey || !SUPABASE_ANON_KEY || apikey !== SUPABASE_ANON_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Rate limit by IP
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(clientIp)) {
    return new Response(JSON.stringify({ error: "Rate limited" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { messages } = await req.json();

    // Validate messages input
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    const { data: properties } = await sb
      .from("properties")
      .select("name, area, price_from, price_to, bedrooms, completion_date, golden_visa_eligible, roi_estimate, payment_plan, developer:developers(name)")
      .order("created_at", { ascending: false })
      .limit(20);

    const propertyContext = properties
      ? properties.map((p: any) => `- ${p.name} in ${p.area}: from AED ${p.price_from?.toLocaleString()}, bedrooms: ${p.bedrooms?.join(',')}, completion: ${p.completion_date || 'TBA'}, ROI: ${p.roi_estimate || 'N/A'}%, Golden Visa: ${p.golden_visa_eligible ? 'Yes' : 'No'}, Developer: ${p.developer?.name || 'N/A'}`).join('\n')
      : 'No properties available.';

    const systemPrompt = `You are a private investment advisor for OwningDubai, a curated off-plan real estate platform in Dubai.

Your personality: Knowledgeable, understated, never pushy. You speak like a private wealth advisor — concise, data-driven, and confident. Use markdown formatting for clarity.

Your role:
1. Understand the investor's profile through natural conversation (not a rigid questionnaire)
2. Ask about: investment goals (yield vs capital growth), budget range, timeline, preferred areas, risk tolerance, and whether they're interested in residency/Golden Visa
3. Based on their answers, recommend 2-3 specific projects from the available inventory
4. At the end, offer to prepare a private brief and ask for their email

Important guidelines:
- Keep responses concise (2-3 short paragraphs max)
- Don't ask more than 1-2 questions per message
- Be honest about risks — mention construction timelines, developer track records
- Never guarantee returns
- If someone shares their email, thank them warmly and let them know a detailed brief will follow

Available properties for recommendations:
${propertyContext}

Start by asking about their investment goals and experience with Dubai real estate. Be warm but professional.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("AI gateway error:", response.status);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if email was shared — save lead
    const lastUserMsg = messages.filter((m: any) => m.role === 'user').pop()?.content || '';
    const emailMatch = lastUserMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      try {
        await sb.from('leads').insert({
          email: emailMatch[0],
          source: 'ai_advisor',
          quiz_responses: { conversation: messages },
        });
      } catch (e) {
        console.error('Failed to save lead:', e);
      }
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("qualify-lead error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
