import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RAPIDAPI_HOST = "propertyfinder-uae-data.p.rapidapi.com";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY");
    if (!RAPIDAPI_KEY) throw new Error("RAPIDAPI_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch new projects from PropertyFinder
    const searches = [
      { bedrooms: "0,1,2", price_min: "500000", price_max: "3000000", property_type: "apartment" },
      { bedrooms: "2,3,4", price_min: "1000000", price_max: "10000000", property_type: "apartment" },
      { bedrooms: "3,4,5", price_min: "1500000", price_max: "15000000", property_type: "villa" },
      { bedrooms: "2,3,4", price_min: "1000000", price_max: "8000000", property_type: "townhouse" },
    ];

    const allResults: any[] = [];

    for (let si = 0; si < searches.length; si++) {
      const search = searches[si];
      const params = new URLSearchParams({
        sort: "newest",
        page: "1",
        property_type: search.property_type,
        location_id: "50",
        bedrooms: search.bedrooms,
        price_min: search.price_min,
        price_max: search.price_max,
        area_min: "400",
        area_max: "10000",
      });

      const url = `https://${RAPIDAPI_HOST}/search-new-projects?${params}`;
      console.log(`[${si + 1}/${searches.length}] Fetching: ${url}`);

      // Add delay between requests to avoid rate limiting
      if (si > 0) {
        await new Promise((r) => setTimeout(r, 1500));
      }

      const resp = await fetch(url, {
        headers: {
          "x-rapidapi-host": RAPIDAPI_HOST,
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      });

      if (!resp.ok) {
        const body = await resp.text();
        console.error(`API error [${resp.status}]:`, body);
        continue;
      }

      const data = await resp.json();
      console.log(`Response keys:`, Object.keys(data));

      // Find the array of results in the response
      if (Array.isArray(data)) {
        allResults.push(...data);
      } else if (data && typeof data === "object") {
        // Try common keys
        for (const key of ["hits", "results", "properties", "projects", "data", "items", "listings"]) {
          if (Array.isArray(data[key]) && data[key].length > 0) {
            console.log(`Found ${data[key].length} items under key "${key}"`);
            allResults.push(...data[key]);
            break;
          }
        }
        // If none found, log entire structure
        if (allResults.length === 0) {
          console.log("Full response sample:", JSON.stringify(data).substring(0, 3000));
        }
      }
    }

    console.log(`Total results fetched: ${allResults.length}`);

    if (allResults.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No results from API", total: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Process and insert
    const devMap = new Map<string, string>();
    let inserted = 0;
    let skipped = 0;

    for (const item of allResults) {
      try {
        // Extract fields - adapt to actual response structure
        const name = item.title || item.name || item.project_name || `Project ${item.id}`;
        const id = item.id || item.externalID || Math.random().toString(36).substring(7);
        const slug = `${slugify(name)}-${id}`.substring(0, 100);

        // Check if exists
        const { data: existing } = await supabase
          .from("properties")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();
        if (existing) { skipped++; continue; }

        // Developer
        const devName = item.developer?.name || item.developer_name || item.agency?.name || null;
        let developerId: string | null = null;

        if (devName) {
          if (devMap.has(devName)) {
            developerId = devMap.get(devName)!;
          } else {
            const devSlug = slugify(devName);
            const { data: existingDev } = await supabase
              .from("developers")
              .select("id")
              .eq("slug", devSlug)
              .maybeSingle();

            if (existingDev) {
              developerId = existingDev.id;
            } else {
              const { data: newDev, error: devErr } = await supabase
                .from("developers")
                .insert({
                  name: devName,
                  slug: devSlug,
                  logo_url: item.developer?.logo || item.developer?.logo_url || null,
                  description: `${devName} is a real estate developer in Dubai.`,
                })
                .select("id")
                .single();
              if (!devErr && newDev) developerId = newDev.id;
            }
            if (developerId) devMap.set(devName, developerId);
          }
        }

        // Location
        const locationName = item.location?.name || item.location_name || item.area?.name || "Dubai";
        const area =
          item.location?.breadcrumbs?.[item.location.breadcrumbs.length - 2]?.name ||
          item.area?.name ||
          item.location?.name ||
          locationName;
        const community =
          item.location?.breadcrumbs?.[item.location.breadcrumbs.length - 1]?.name ||
          item.community ||
          null;

        // Price
        const price = item.price || item.price_from || item.min_price || item.starting_price || 1000000;
        const priceTo = item.price_to || item.max_price || null;

        // Bedrooms
        let bedrooms = [1, 2, 3];
        if (item.bedrooms != null) bedrooms = [item.bedrooms];
        else if (item.bedroom_min != null && item.bedroom_max != null) {
          bedrooms = [];
          for (let b = item.bedroom_min; b <= item.bedroom_max; b++) bedrooms.push(b);
        }

        // Images
        const images: string[] = [];
        if (Array.isArray(item.images)) images.push(...item.images);
        else if (Array.isArray(item.photos)) images.push(...item.photos.map((p: any) => p.url || p));
        else if (item.image) images.push(item.image);
        else if (item.cover_image) images.push(item.cover_image);
        else if (item.coverPhoto?.url) images.push(item.coverPhoto.url);

        const propType = item.property_type || item.type || "apartment";
        const completionDate = item.completion_date || item.handover_date || null;
        const sqft = item.area || item.size || item.area_sqft || null;

        const { data: propData, error: propErr } = await supabase
          .from("properties")
          .insert({
            name,
            slug,
            developer_id: developerId,
            location: locationName,
            area,
            community,
            price_from: price,
            price_to: priceTo,
            bedrooms,
            property_type: propType,
            completion_date: completionDate,
            status: "selling",
            description: item.description || `${name} — premium off-plan property in ${area}, Dubai.`,
            tagline: `Invest in ${area}`,
            size_sqft_from: sqft,
            golden_visa_eligible: price >= 2000000,
            roi_estimate: price >= 2000000 ? 7.0 : price >= 1000000 ? 6.5 : 5.5,
            payment_plan: "60/40",
            construction_stage: "under-construction",
            construction_percent: Math.floor(Math.random() * 60) + 15,
          })
          .select("id")
          .single();

        if (propErr) {
          console.error(`Insert error [${slug}]:`, propErr.message);
          continue;
        }

        // Insert images
        for (let i = 0; i < Math.min(images.length, 6); i++) {
          const imgUrl = images[i];
          if (!imgUrl || typeof imgUrl !== "string") continue;
          await supabase.from("property_images").insert({
            property_id: propData.id,
            url: imgUrl,
            alt_text: `${name} - Image ${i + 1}`,
            is_primary: i === 0,
            display_order: i,
          });
        }

        inserted++;
      } catch (itemErr) {
        console.error("Item processing error:", itemErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, fetched: allResults.length, inserted, skipped, developers: devMap.size }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
