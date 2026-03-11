import { Helmet } from 'react-helmet-async';
import { useTenant } from '@/hooks/useTenant';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export const SEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
}: SEOProps) => {
  const { tenant } = useTenant();

  // Build defaults from tenant config
  const defaults = {
    title: tenant?.seo_config?.default_title || `${tenant?.brand_name || 'Owning'} | Premium Off-Plan Properties`,
    description: tenant?.seo_config?.default_description || description || 'Your gateway to premium real estate. Discover exclusive off-plan properties with flexible payment plans.',
    image: tenant?.seo_config?.og_image_url || image || 'https://owningdubai.com/og-image.png',
    url: tenant?.domain ? `https://${tenant.domain}` : 'https://owningdubai.com',
    titleTemplate: tenant?.seo_config?.title_template || '%s | ' + (tenant?.brand_name || 'Owning'),
  };

  // Build full title
  const fullTitle = title 
    ? defaults.titleTemplate.replace('%s', title)
    : defaults.title;

  const finalDescription = description || defaults.description;
  const finalImage = image || defaults.image;
  const finalUrl = url || defaults.url;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={finalDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={finalUrl} />
    </Helmet>
  );
};