import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO = ({ title, description, image, url }: SEOProps) => {
  useEffect(() => {
    const siteTitle = 'HerbSpa Lab';
    const fullTitle = `${title} | ${siteTitle}`;
    document.title = fullTitle;
    
    // Helper function to update meta tags
    const updateMetaTag = (attribute: string, value: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${value}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute(attribute, value);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    if (description) {
      updateMetaTag('name', 'description', description);
      updateMetaTag('property', 'og:description', description);
    }

    updateMetaTag('property', 'og:title', fullTitle);
    
    if (image) {
      updateMetaTag('property', 'og:image', image);
    }

    if (url) {
      updateMetaTag('property', 'og:url', url);
    }
  }, [title, description, image, url]);

  return null;
};

export default SEO;
