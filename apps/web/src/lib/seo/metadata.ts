import type { Metadata } from 'next';

import { SITE_CONFIG, getCanonicalUrl } from '@/lib/seo/site-config';

type PageMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description = SITE_CONFIG.description,
  path = '/',
  noIndex = false,
  keywords,
}: PageMetadataInput): Metadata {
  const canonical = getCanonicalUrl(path);
  const ogImage = getCanonicalUrl(SITE_CONFIG.defaultOgImagePath);
  return {
    title,
    description,
    keywords: keywords ?? [...SITE_CONFIG.keywords],
    authors: [...SITE_CONFIG.authors],
    creator: SITE_CONFIG.creator,
    publisher: SITE_CONFIG.publisher,
    category: SITE_CONFIG.category,
    applicationName: SITE_CONFIG.shortName,
    metadataBase: new URL(getCanonicalUrl('/')),
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url: canonical,
      siteName: SITE_CONFIG.name,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: SITE_CONFIG.twitterHandle,
      site: SITE_CONFIG.twitterHandle,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}

export function createRootMetadata(): Metadata {
  return {
    ...createPageMetadata({
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      path: '/',
    }),
    title: {
      default: SITE_CONFIG.name,
      template: `%s · ${SITE_CONFIG.shortName}`,
    },
    manifest: '/site.webmanifest',
    icons: {
      icon: [{ url: '/favicon.ico', sizes: 'any' }],
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}
