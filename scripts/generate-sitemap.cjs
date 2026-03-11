/**
 * Generates sitemap.xml at build time.
 * Fetches dynamic slugs from Supabase and outputs to public/sitemap.xml.
 *
 * Usage: node scripts/generate-sitemap.js
 * Run this before or after `vite build`.
 */

const SITE_URL = 'https://owningdubai.com';
const SUPABASE_URL = 'https://mmmlhwqxzxfrsmkigdbj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tbWxod3F4enhmcnNta2lnZGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4MTM3MDMsImV4cCI6MjA4MzM4OTcwM30.5DXxxmCP_Sr-bMtcmQZ_5ZTGksoj2eiRc_C2rjeO2gc';

const fs = require('fs');
const path = require('path');

async function fetchSlugs(table, select = 'slug') {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=${select}&limit=1000`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  if (!res.ok) return [];
  return (await res.json()).map((r) => r.slug).filter(Boolean);
}

function urlEntry(loc, priority = '0.5', changefreq = 'weekly') {
  const lastmod = new Date().toISOString().split('T')[0];
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
  console.log('Generating sitemap.xml...');

  // Static pages
  const entries = [
    urlEntry('/', '1.0', 'daily'),
    urlEntry('/properties', '0.9', 'daily'),
    urlEntry('/developers', '0.8', 'weekly'),
    urlEntry('/areas', '0.8', 'weekly'),
    urlEntry('/insights', '0.8', 'weekly'),
    urlEntry('/market', '0.7', 'weekly'),
    urlEntry('/calculator', '0.6', 'monthly'),
    urlEntry('/advisor', '0.7', 'monthly'),
    urlEntry('/about', '0.4', 'monthly'),
    urlEntry('/how-it-works', '0.5', 'monthly'),
    urlEntry('/contact', '0.5', 'monthly'),
    urlEntry('/discover', '0.6', 'weekly'),
  ];

  // Dynamic pages
  const [properties, developers, areas, articles] = await Promise.all([
    fetchSlugs('properties'),
    fetchSlugs('developers'),
    fetchSlugs('area_market_data', 'area_slug'),
    fetchSlugs('articles'),
  ]);

  for (const slug of properties) {
    entries.push(urlEntry(`/properties/${slug}`, '0.8', 'weekly'));
  }
  for (const slug of developers) {
    entries.push(urlEntry(`/developers/${slug}`, '0.7', 'weekly'));
  }
  for (const slug of [...new Set(areas)]) {
    entries.push(urlEntry(`/areas/${slug}`, '0.7', 'weekly'));
  }
  for (const slug of articles) {
    entries.push(urlEntry(`/insights/${slug}`, '0.6', 'monthly'));
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

  const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outPath, sitemap, 'utf-8');
  console.log(`Sitemap written to ${outPath} (${entries.length} URLs)`);
}

main().catch(console.error);
