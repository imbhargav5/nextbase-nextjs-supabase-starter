import { ImageResponse } from 'next/og';

import { SITE_CONFIG } from '@/lib/seo/site-config';

export const runtime = 'edge';

export const alt = `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(145deg, #0a0a0a 0%, #171717 45%, #262626 100%)',
          color: '#fafafa',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0a0a0a',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>
            {SITE_CONFIG.shortName}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            Ship your SaaS faster
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: '#d4d4d4' }}>
            {SITE_CONFIG.tagline}
          </div>
        </div>
        <div style={{ fontSize: 22, color: '#a3a3a3' }}>
          Next.js 16 · Supabase · shadcn/ui · Templates · SEO-ready
        </div>
      </div>
    ),
    { ...size },
  );
}
