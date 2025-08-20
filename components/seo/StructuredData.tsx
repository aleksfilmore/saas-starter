import Head from 'next/head';

interface StructuredDataProps {
  type: 'WebApplication' | 'Organization' | 'Article' | 'Service' | 'HowTo';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      ...data
    };

    // Add common organization data for relevant types
    if (type === 'WebApplication' || type === 'Service') {
      baseData.provider = {
        "@type": "Organization",
        "name": "CTRL+ALT+BLOCK",
        "url": "https://ctrlaltblock.com",
        "logo": "https://ctrlaltblock.com/logo.png"
      };
    }

    return baseData;
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getStructuredData())
        }}
      />
    </Head>
  );
}

// Pre-configured structured data for common use cases
export const WebApplicationSchema = {
  name: "CTRL+ALT+BLOCK",
  alternateName: "CTRL+ALT+BLOCK™",
  description: "Evidence-based digital healing platform combining neuroscience, gamification, and AI therapy to help you break toxic relationship patterns and build unshakeable self-worth.",
  url: "https://ctrlaltblock.com",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web, iOS, Android",
  offers: {
    "@type": "Offer",
    "category": "Mental Health & Wellness",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  creator: {
    "@type": "Organization",
    "name": "CTRL+ALT+BLOCK Team"
  },
  keywords: "toxic relationships, no contact, self worth, healing, neuroscience, AI therapy, breakup recovery, emotional healing, relationship trauma, self improvement",
  audience: {
    "@type": "Audience",
    "audienceType": "People recovering from toxic relationships"
  },
  featureList: [
    "AI-powered healing archetype assessment",
    "Personalized daily healing rituals", 
    "No-contact streak tracking",
    "Anonymous community support",
    "Gamified progress tracking",
    "24/7 AI therapy chat"
  ]
};

export const OrganizationSchema = {
  name: "CTRL+ALT+BLOCK",
  alternateName: "CTRL+ALT+BLOCK™",
  url: "https://ctrlaltblock.com",
  logo: "https://ctrlaltblock.com/logo.png",
  description: "Digital healing platform for toxic relationship recovery",
  contactPoint: {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "areaServed": "Worldwide",
    "availableLanguage": "English"
  },
  sameAs: [
    "https://twitter.com/ctrlaltblock",
    "https://instagram.com/ctrlaltblock",
    "https://linkedin.com/company/ctrlaltblock"
  ]
};

export const ServiceSchema = {
  name: "Digital Therapy & Healing Platform",
  description: "AI-powered platform for healing from toxic relationships and building self-worth",
  provider: {
    "@type": "Organization",
    "name": "CTRL+ALT+BLOCK"
  },
  areaServed: "Worldwide",
  availableChannel: {
    "@type": "ServiceChannel",
    "serviceType": "Digital Platform",
    "availableLanguage": "English"
  },
  category: "Mental Health & Wellness",
  offers: {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
};
