import type { Metadata } from "next";

export const siteConfig = {
  name: "Creor",
  url: "https://creor.ai",
  description:
    "Open-source AI-native code editor with 19+ LLM providers, built-in agents, and terminal-first workflow. No vendor lock-in.",
  keywords: [
    "AI code editor",
    "open source IDE",
    "AI coding agent",
    "Creor",
    "VS Code fork",
    "multi-provider AI",
    "terminal-first",
    "code editor",
    "developer tools",
    "AI pair programming",
  ],
  links: {
    github: "https://github.com/modhisathvik7733/creor-app",
    twitter: "https://twitter.com/creor_ai",
  },
};

export function generatePageMetadata(config?: {
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const title = config?.title
    ? `${config.title} — ${siteConfig.name}`
    : `${siteConfig.name} — The AI-Native Code Editor`;

  const description = config?.description || siteConfig.description;
  const url = `${siteConfig.url}${config?.path || ""}`;

  return {
    title,
    description,
    keywords: siteConfig.keywords,
    authors: [{ name: "Creor" }],
    creator: "Creor",
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/og-image.svg`,
          width: 1200,
          height: 630,
          alt: title as string,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteConfig.url}/og-image.svg`],
      creator: "@creor_ai",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
  };
}
