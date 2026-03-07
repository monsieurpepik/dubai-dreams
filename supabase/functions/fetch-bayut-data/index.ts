import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RAPIDAPI_HOST = "propertyfinder-uae-data.p.rapidapi.com";

interface PFProperty {
  id: number;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  property_type: string;
  furnishing: string;
  completion_status: string;
  location: { name: string; breadcrumbs?: { name: string }[] };
  images: string[];
  developer?: { name: string; logo?: string };
  description?: string;
  amenities?: string[];
  added_on?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 80);
}

function extractArea(location: PFProperty["location"]): string {
  if (location.breadcrumbs && location.breadcrumbs.length >= 2) {
    return location.breadcrumbs[location.breadcrumbs.length - 2]?.name || location.name;
  }
  return location.name || "Dubai";
}

function extractCommunity(location: PFProperty["location"]): string | null {
  if (location.breadcrumbs && location.breadcrumbs.length >= 3) {
    return location.breadcrumbs[location.breadcrumbs.length - 1]?.name || null;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAPIDAPI_KEY = Deno.env.get("RAPIDAPI_KEY");
    if (!RAPIDAPI_KEY) {
      throw new Error("RAPIDAPI_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch multiple pages of off-plan properties across different configs
    const searches = [
      { location_id: "50", bedrooms: "0,1,2", price_min: "500000", price_max: "3000000", property_type: "apartment" },
      { location_id: "50", bedrooms: "2,3,4", price_min: "1000000", price_max: "10000000", property_type: "apartment" },
      { location_id: "50", bedrooms: "3,4,5", price_min: "2000000", price_max: "50000000", property_type: "villa" },
      { location_id: "50", bedrooms: "1,2", price_min: "800000", price_max: "5000000", property_type: "townhouse" },
    ];

    const allProperties: PFProperty[] = [];

    for (const search of searches) {
      const params = new URLSearchParams({
        completion_status: "off_plan",
        sort: "newest",
        page: "1",
        property_type: search.property_type,
        location_id: search.location_id,
        bedrooms: search.bedrooms,
        price_min: search.price_min,
        price_max: search.price_max,
      });

      const url = `https://${RAPIDAPI_HOST}/search-buy?${params}`;
      console.log("Fetching:", url);

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
      const hits = data?.hits || data?.results || data?.properties || [];
      
      if (Array.isArray(hits)) {
        allProperties.push(...hits);
      } else if (data && typeof data === "object") {
        // Try to find array in response
        for (const key of Object.keys(data)) {
          if (Array.isArray(data[key]) && data[key].length > 0) {
            allProperties.push(...data[key]);
            break;
          }
        }
      }
    }

    console.log(`Total properties fetched: ${allProperties.length}`);

    if (allProperties.length === 0) {
      // Log the raw response for debugging
      const debugResp = await fetch(
        `https://${RAPIDAPI_HOST}/search-buy?completion_status=off_plan&sort=newest&page=1&property_type=apartment&location_id=50&bedrooms=1,2&price_min=500000&price_max=3000000`,
        {
          headers: {
            "x-rapidapi-host": RAPIDAPI_HOST,
            "x-rapidapi-key": RAPIDAPI_KEY,
          },
        }
      );
      const debugData = await debugResp.json();
      console.log("Debug response keys:", Object.keys(debugData));
      console.log("Debug response sample:", JSON.stringify(debugData).substring(0, 2000));

      return new Response(
        JSON.stringify({
          success: false,
          message: "No properties found in API response",
          debug_keys: Object.keys(debugData),
          sample: JSON.stringify(debugData).substring(0, 500),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Deduplicate by id
    const seen = new Set<number>();
    const unique = allProperties.filter((p) => {
      if (!p.id || seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    console.log(`Unique properties: ${unique.length}`);

    // Step 1: Upsert developers
    const devMap = new Map<string, string>(); // name -> id
    for (const p of unique) {
      const devName = p.developer?.name;
      if (devName && !devMap.has(devName)) {
        const devSlug = slugify(devName);
        const { data: existing } = await supabase
          .from("developers")
          .select("id")
          .eq("slug", devSlug)
          .maybeSingle();

        if (existing) {
          devMap.set(devName, existing.id);
        } else {
          const { data: inserted, error } = await supabase
            .from("developers")
            .insert({
              name: devName,
              slug: devSlug,
              logo_url: p.developer?.logo || null,
              description: `${devName} is a premier real estate developer in Dubai.`,
            })
            .select("id")
            .single();

          if (error) {
            console.error(`Dev insert error for ${devName}:`, error.message);
          } else {
            devMap.set(devName, inserted.id);
          }
        }
      }
    }

    console.log(`Developers upserted: ${devMap.size}`);

    // Step 2: Insert properties
    let inserted = 0;
    let skipped = 0;

    for (const p of unique) {
      const name = p.title || `Property ${p.id}`;
      const baseSlug = slugify(name);
      const slug = `${baseSlug}-${p.id}`;

      // Check if already exists
      const { data: existingProp } = await supabase
        .from("properties")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

      if (existingProp) {
        skipped++;
        continue;
      }

      const devName = p.developer?.name;
      const developerId = devName ? devMap.get(devName) || null : null;
      const area = extractArea(p.location);
      const community = extractCommunity(p.location);

      const bedrooms = p.bedrooms != null ? [p.bedrooms] : [1, 2, 3];
      const priceFrom = p.price || 1000000;

      const propertyData = {
        name,
        slug,
        developer_id: developerId,
        location: p.location?.name || "Dubai",
        area,
        community,
        price_from: priceFrom,
        bedrooms,
        property_type: p.property_type || "apartment",
        furnishing_status: p.furnishing || "unfurnished",
        status: "selling",
        description: p.description || `${name} — premium off-plan property in ${area}, Dubai.`,
        tagline: `Invest in ${area}`,
        size_sqft_from: p.area || null,
        golden_visa_eligible: priceFrom >= 2000000,
        roi_estimate: priceFrom >= 2000000 ? 7.5 : priceFrom >= 1000000 ? 6.5 : 5.5,
        payment_plan: "60/40",
        construction_stage: "under-construction",
        construction_percent: Math.floor(Math.random() * 60) + 10,
      };

      const { data: propInserted, error: propError } = await supabase
        .from("properties")
        .insert(propertyData)
        .select("id")
        .single();

      if (propError) {
        console.error(`Property insert error [${slug}]:`, propError.message);
        continue;
      }

      // Step 3: Insert images
      const images = p.images || [];
      for (let i = 0; i < Math.min(images.length, 6); i++) {
        const imgUrl = images[i];
        if (!imgUrl) continue;

        await supabase.from("property_images").insert({
          property_id: propInserted.id,
          url: imgUrl,
          alt_text: `${name} - Image ${i + 1}`,
          is_primary: i === 0,
          display_order: i,
        });
      }

      inserted++;
    }

    console.log(`Inserted: ${inserted}, Skipped: ${skipped}`);

    return new Response(
      JSON.stringify({
        success: true,
        fetched: unique.length,
        developers: devMap.size,
        inserted,
        skipped,
      }),
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
