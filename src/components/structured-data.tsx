import { siteConfig } from "@/lib/metadata";

export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: `${siteConfig.url}/icon.svg`,
          description: siteConfig.description,
          sameAs: [siteConfig.links.github, siteConfig.links.twitter],
        }),
      }}
    />
  );
}

export function SoftwareApplicationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: siteConfig.name,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Windows, macOS, Linux",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          description: siteConfig.description,
        }),
      }}
    />
  );
}
