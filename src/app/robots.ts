import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://courseit.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/landing', '/auth/login', '/auth/signup'],
      disallow: ['/dashboard', '/sessions', '/settings', '/courses/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
