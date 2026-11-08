import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  /** true when `title` already carries the brand (e.g. a post's SEO title). */
  rawTitle?: boolean;
  type?: 'website' | 'article';
}

const DEFAULT_IMAGE = 'https://www.mindsetcaro.com/mindset-caro/og-blindaje.png';

export const SEOHead = ({ title, description, canonicalUrl, ogImage, rawTitle, type = 'website' }: SEOHeadProps) => {
  const fullTitle = rawTitle ? title : `${title} | Mindset Caro`;
  const image = ogImage || DEFAULT_IMAGE;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
