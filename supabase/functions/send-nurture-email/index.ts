import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const INTERNAL_SECRET = Deno.env.get("INTERNAL_FUNCTION_SECRET");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-internal-secret, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function sendEmail(to: string[], subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "OwningDubai <leads@owningdubai.com>",
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
  return res.json();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Authenticate: require internal secret only (cron-only function)
  const internalSecret = req.headers.get("x-internal-secret");

  if (!INTERNAL_SECRET || internalSecret !== INTERNAL_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const action = body.action || "process";

    if (action === "schedule") {
      const { leadId } = body;
      if (!leadId) throw new Error("Missing leadId");

      const { data: lead, error: leadErr } = await supabase
        .from("leads")
        .select("*, property:properties(name, area, price_from, roi_estimate)")
        .eq("id", leadId)
        .maybeSingle();

      if (leadErr || !lead) throw new Error("Lead not found");

      const now = new Date();
      const sequences = [
        { email_number: 1, email_type: "investment_report", scheduled_at: now.toISOString() },
        { email_number: 2, email_type: "market_insights", scheduled_at: new Date(now.getTime() + 3 * 86400000).toISOString() },
        { email_number: 3, email_type: "similar_properties", scheduled_at: new Date(now.getTime() + 7 * 86400000).toISOString() },
      ];

      const { error: insertErr } = await supabase
        .from("email_sequences")
        .insert(sequences.map(s => ({ ...s, lead_id: leadId, status: "pending" })));

      if (insertErr) throw insertErr;

      console.log(`Scheduled ${sequences.length} nurture emails for lead ${leadId}`);
      return new Response(JSON.stringify({ success: true, scheduled: sequences.length }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Process: send pending emails that are due
    const { data: pending, error: pendingErr } = await supabase
      .from("email_sequences")
      .select("*, lead:leads(name, email, property:properties(name, area, price_from, roi_estimate, slug))")
      .eq("status", "pending")
      .lte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(20);

    if (pendingErr) throw pendingErr;
    if (!pending?.length) {
      console.log("No pending emails to send");
      return new Response(JSON.stringify({ success: true, sent: 0 }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let sent = 0;
    for (const seq of pending) {
      const lead = seq.lead as any;
      if (!lead?.email) continue;

      const property = lead.property as any;
      const name = escapeHtml(lead.name || "Investor");
      let subject = "";
      let html = "";

      const propertyName = property?.name ? escapeHtml(property.name) : null;
      const propertyArea = property?.area ? escapeHtml(property.area) : null;

      switch (seq.email_type) {
        case "investment_report":
          subject = `Your Investment Report${propertyName ? `: ${propertyName}` : ""}`;
          html = `
            <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
              <h1 style="font-size:24px;font-weight:300;letter-spacing:1px;">OWNING DUBAI</h1>
              <p>Dear ${name},</p>
              <p>Thank you for your interest${propertyName ? ` in <strong>${propertyName}</strong> (${propertyArea})` : ""}.</p>
              ${property ? `
                <div style="background:#f9f9f9;padding:20px;margin:16px 0;">
                  <p style="margin:4px 0;"><strong>Starting from:</strong> AED ${(property.price_from / 1000000).toFixed(1)}M</p>
                  ${property.roi_estimate ? `<p style="margin:4px 0;"><strong>Estimated Yield:</strong> ${property.roi_estimate}%</p>` : ""}
                  <p style="margin:4px 0;"><strong>Location:</strong> ${propertyArea}</p>
                </div>
              ` : ""}
              <p>Our investment advisory team will be in touch within 24 hours to discuss your goals and provide personalized recommendations.</p>
              <p style="color:#888;font-size:12px;">— The OwningDubai Team</p>
            </div>`;
          break;

        case "market_insights":
          subject = `Dubai Market Update: ${propertyArea || "Latest Trends"}`;
          html = `
            <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
              <h1 style="font-size:24px;font-weight:300;letter-spacing:1px;">OWNING DUBAI</h1>
              <p>Dear ${name},</p>
              <p>Here's a quick market update for ${propertyArea || "Dubai"}:</p>
              <ul>
                <li>Dubai property transactions hit record highs in 2024</li>
                <li>Off-plan properties offer 10-18% discount vs. ready market</li>
                <li>Average rental yields remain 6-8% across prime locations</li>
              </ul>
              <p>Would you like a detailed market analysis for your area of interest? Simply reply to this email.</p>
              <p style="color:#888;font-size:12px;">— The OwningDubai Team</p>
            </div>`;
          break;

        case "similar_properties":
          subject = "Curated Properties You Might Like";
          html = `
            <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
              <h1 style="font-size:24px;font-weight:300;letter-spacing:1px;">OWNING DUBAI</h1>
              <p>Dear ${name},</p>
              <p>Based on your interest${propertyArea ? ` in ${propertyArea}` : ""}, we've curated similar projects you might like.</p>
              <p><a href="https://owningdubai.com/properties" style="color:#D4AF37;text-decoration:none;font-weight:600;">Browse Curated Projects →</a></p>
              <p>Our advisors are available for a private consultation to walk you through the best options for your investment goals.</p>
              <p><a href="https://owningdubai.com/contact" style="color:#D4AF37;text-decoration:none;">Schedule a Consultation →</a></p>
              <p style="color:#888;font-size:12px;">— The OwningDubai Team</p>
            </div>`;
          break;
      }

      try {
        await sendEmail([lead.email], subject, html);
        await supabase
          .from("email_sequences")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("id", seq.id);
        sent++;
        console.log(`Sent email #${seq.email_number} (${seq.email_type}) to ${lead.email}`);
      } catch (e) {
        console.error(`Failed to send email ${seq.id}:`, e);
        await supabase
          .from("email_sequences")
          .update({ status: "failed" })
          .eq("id", seq.id);
      }
    }

    return new Response(JSON.stringify({ success: true, sent }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-nurture-email:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
