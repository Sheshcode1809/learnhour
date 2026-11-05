import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  let baseUrl: string | undefined;
  try {
    const parsed = configuredUrl ? new URL(configuredUrl) : null;
    if (parsed?.protocol === 'https:') baseUrl = parsed.origin;
  } catch {
    baseUrl = undefined;
  }

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/about', '/privacy', '/terms', '/contact'],
      disallow: ['/auth', '/dashboard', '/courses', '/sessions', '/settings', '/api'],
    },
    ...(baseUrl ? { sitemap: `${baseUrl}/sitemap.xml` } : {}),
  };
}

