import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const INTERNAL_SECRET = Deno.env.get("INTERNAL_FUNCTION_SECRET");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-internal-secret, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Authenticate: require internal secret only (cron-only function)
  const internalSecret = req.headers.get("x-internal-secret");

  if (!INTERNAL_SECRET || internalSecret !== INTERNAL_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Checking saved searches for new matches...');

    const { data: savedSearches, error: searchError } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('is_active', true);

    if (searchError) {
      console.error('Error fetching saved searches:', searchError);
      throw searchError;
    }

    if (!savedSearches || savedSearches.length === 0) {
      console.log('No active saved searches found.');
      return new Response(JSON.stringify({ message: 'No active saved searches' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let notificationsSent = 0;

    for (const search of savedSearches) {
      const sinceDate = search.last_notified_at || search.created_at;
      const filters = search.filters as Record<string, any>;

      let query = supabase
        .from('properties')
        .select('id, name, slug, area, price_from, developer:developers(name)')
        .gte('created_at', sinceDate)
        .order('created_at', { ascending: false })
        .limit(10);

      if (filters.area && filters.area !== 'All Areas') {
        query = query.eq('area', filters.area);
      }
      if (filters.priceRange) {
        if (filters.priceRange[0] > 500000) {
          query = query.gte('price_from', filters.priceRange[0]);
        }
        if (filters.priceRange[1] < 50000000) {
          query = query.lte('price_from', filters.priceRange[1]);
        }
      }
      if (filters.category) {
        switch (filters.category) {
          case 'golden-visa':
            query = query.eq('golden_visa_eligible', true);
            break;
          case 'high-yield':
            query = query.gte('roi_estimate', 7);
            break;
        }
      }

      const { data: newProperties, error: propError } = await query;

      if (propError) {
        console.error(`Error querying properties for search ${search.id}:`, propError);
        continue;
      }

      if (!newProperties || newProperties.length === 0) {
        console.log(`No new matches for search ${search.id}`);
        continue;
      }

      console.log(`Found ${newProperties.length} new matches for search ${search.id}`);

      if (resendApiKey) {
        const resend = new Resend(resendApiKey);

        const propertyList = newProperties.map(p => {
          const dev = (p.developer as any)?.name || '';
          return `<li style="margin-bottom:8px;"><strong>${p.name}</strong>${dev ? ` by ${dev}` : ''} — ${p.area} — From AED ${p.price_from.toLocaleString()}</li>`;
        }).join('');

        try {
          await resend.emails.send({
            from: 'OwningDubai <alerts@owningdubai.com>',
            to: [search.email],
            subject: `${newProperties.length} new ${newProperties.length === 1 ? 'property matches' : 'properties match'} your search`,
            html: `
              <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;">
                <h2 style="font-size:20px;">New Properties Matching Your Search</h2>
                <p style="color:#666;font-size:14px;">
                  Hi${search.name ? ` ${search.name}` : ''}, we found ${newProperties.length} new ${newProperties.length === 1 ? 'property' : 'properties'} matching your saved criteria.
                </p>
                <ul style="padding-left:20px;font-size:14px;">${propertyList}</ul>
                <p style="margin-top:24px;">
                  <a href="https://owningdubai.com/properties" style="background:#000;color:#fff;padding:12px 24px;text-decoration:none;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">
                    View Properties
                  </a>
                </p>
                <p style="margin-top:32px;font-size:11px;color:#999;">
                  You're receiving this because you saved a search on OwningDubai.com.
                </p>
              </div>
            `,
          });
          notificationsSent++;
        } catch (emailError) {
          console.error(`Failed to send email to ${search.email}:`, emailError);
        }
      }

      await supabase
        .from('saved_searches')
        .update({ last_notified_at: new Date().toISOString() })
        .eq('id', search.id);
    }

    console.log(`Done. Sent ${notificationsSent} notifications.`);

    return new Response(
      JSON.stringify({ message: `Processed ${savedSearches.length} searches, sent ${notificationsSent} notifications` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in check-saved-searches:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
