import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL") || "hello@owningdubai.com";
const INTERNAL_SECRET = Deno.env.get("INTERNAL_FUNCTION_SECRET");

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function validateEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) && email.length <= 255;
}

function validatePhone(phone: string): boolean {
  return /^[+\d\s\-().]{5,20}$/.test(phone);
}

async function sendEmail(to: string[], subject: string, html: string): Promise<{ id: string }> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "OwningDubai <leads@owningdubai.com>",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return response.json();
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-internal-secret",
};

interface LeadNotificationRequest {
  leadName: string | null;
  leadEmail: string;
  leadPhone: string | null;
  propertyName: string | null;
  propertyId: string | null;
  source: string;
  message?: string;
  goldenVisaInterest?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Authenticate: require internal secret OR valid Supabase JWT
  const internalSecret = req.headers.get("x-internal-secret");
  const authHeader = req.headers.get("authorization");

  let authenticated = false;

  // Check internal secret first
  if (INTERNAL_SECRET && internalSecret === INTERNAL_SECRET) {
    authenticated = true;
  }

  // Fall back to Supabase anon key (client calls include apikey header)
  if (!authenticated) {
    const apikey = req.headers.get("apikey");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    if (apikey && SUPABASE_ANON_KEY && apikey === SUPABASE_ANON_KEY) {
      authenticated = true;
    }
  }

  if (!authenticated) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const data: LeadNotificationRequest = await req.json();

    // Validate required fields
    if (!data.leadEmail || !validateEmail(data.leadEmail)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (data.leadPhone && !validatePhone(data.leadPhone)) {
      return new Response(JSON.stringify({ error: "Invalid phone number" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Enforce length limits
    const leadName = data.leadName ? escapeHtml(data.leadName.substring(0, 100)) : null;
    const leadEmail = escapeHtml(data.leadEmail);
    const leadPhone = data.leadPhone ? escapeHtml(data.leadPhone.substring(0, 20)) : null;
    const propertyName = data.propertyName ? escapeHtml(data.propertyName.substring(0, 200)) : null;
    const message = data.message ? escapeHtml(data.message.substring(0, 2000)) : null;
    const source = escapeHtml((data.source || 'unknown').substring(0, 50));
    const goldenVisaInterest = data.goldenVisaInterest === true;

    console.log("Processing lead notification for:", leadEmail);

    const propertyInfo = propertyName
      ? `<p><strong>Property:</strong> ${propertyName}</p>`
      : '<p><strong>Property:</strong> General inquiry</p>';

    const phoneInfo = leadPhone
      ? `<p><strong>Phone:</strong> <a href="tel:${leadPhone}">${leadPhone}</a></p>`
      : '';

    const messageInfo = message
      ? `<p><strong>Message:</strong></p><p style="background:#f5f5f5;padding:12px;border-radius:4px;">${message}</p>`
      : '';

    const goldenVisaInfo = goldenVisaInterest
      ? '<p style="color:#D4AF37;font-weight:bold;">🏆 Interested in Golden Visa</p>'
      : '';

    const timestamp = new Date().toLocaleString('en-AE', {
      timeZone: 'Asia/Dubai',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 24px; }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; }
          .content { background: #ffffff; padding: 24px; border: 1px solid #eee; }
          .lead-card { background: #f9f9f9; border-radius: 8px; padding: 20px; margin: 16px 0; }
          .lead-card p { margin: 8px 0; }
          .cta-button { display: inline-block; background: #D4AF37; color: #000; padding: 12px 24px; text-decoration: none; font-weight: 600; border-radius: 4px; margin-top: 16px; }
          .footer { text-align: center; padding: 16px; color: #888; font-size: 12px; }
          .priority-high { border-left: 4px solid #D4AF37; padding-left: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>OWNING DUBAI</h1>
            <p style="margin:8px 0 0;opacity:0.8;font-size:14px;">New Lead Alert</p>
          </div>
          
          <div class="content">
            <p style="color:#888;font-size:12px;">${timestamp}</p>
            
            <div class="lead-card ${goldenVisaInterest ? 'priority-high' : ''}">
              <p><strong>Name:</strong> ${leadName || 'Not provided'}</p>
              <p><strong>Email:</strong> <a href="mailto:${leadEmail}">${leadEmail}</a></p>
              ${phoneInfo}
              ${propertyInfo}
              <p><strong>Source:</strong> ${source.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
              ${goldenVisaInfo}
              ${messageInfo}
            </div>
            
            <p style="font-weight:600;">⏰ Recommended response time: Within 30 minutes</p>
            
            <a href="mailto:${leadEmail}" class="cta-button">Reply to Lead</a>
            ${leadPhone ? `<a href="https://wa.me/${leadPhone.replace(/\D/g, '')}" class="cta-button" style="margin-left:8px;background:#25D366;color:white;">WhatsApp</a>` : ''}
          </div>
          
          <div class="footer">
            <p>This is an automated notification from OwningDubai Lead System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const salesEmailResponse = await sendEmail(
      [NOTIFICATION_EMAIL],
      `🏠 New Lead: ${leadName || leadEmail} ${propertyName ? `- ${propertyName}` : ''}`,
      emailHtml
    );

    console.log("Sales notification email sent:", salesEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Lead notification sent successfully",
        salesEmailId: salesEmailResponse.id
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in send-lead-notification function:", errorMessage);

    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
