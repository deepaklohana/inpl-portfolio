import type { NextConfig } from "next";

function hostnameFromUrl(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const nextConfig: NextConfig = {
  // Prisma should not be bundled — it needs native binaries on Vercel
  serverExternalPackages: ['@prisma/client', 'prisma'],
  transpilePackages: [
    '@tiptap/react',
    '@tiptap/core',
    '@tiptap/pm',
    '@tiptap/starter-kit',
    '@tiptap/extension-image',
    '@tiptap/extension-link',
  ],
  images: {
    remotePatterns: [
      // Supabase Storage public buckets (project-specific)
      ...(hostnameFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
        ? [
            {
              protocol: 'https' as const,
              hostname: hostnameFromUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)!,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
      {
        // Supabase project URLs (any region/project)
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
