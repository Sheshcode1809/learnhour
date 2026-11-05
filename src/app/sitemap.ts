import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!configuredUrl) return [];

  let baseUrl: string;
  try {
    const parsed = new URL(configuredUrl);
    if (parsed.protocol !== 'https:') return [];
    baseUrl = parsed.origin;
  } catch {
    return [];
  }

  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...['about', 'contact'].map((path) => ({
      url: `${baseUrl}/${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    })),
  ];
}

