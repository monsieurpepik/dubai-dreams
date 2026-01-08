import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const defaultMeta = {
  title: 'OwningDubai | Premium Off-Plan Properties in Dubai',
  description: 'Your gateway to premium Dubai real estate. Discover exclusive off-plan properties from AED 480,000 with flexible payment plans and Golden Visa eligibility.',
  image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=630&fit=crop',
  url: 'https://owningdubai.com',
};

export const SEO = ({
  title,
  description = defaultMeta.description,
  image = defaultMeta.image,
  url = defaultMeta.url,
  type = 'website',
}: SEOProps) => {
  const fullTitle = title 
    ? `${title} | OwningDubai` 
    : defaultMeta.title;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
