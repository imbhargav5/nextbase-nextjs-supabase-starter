'use client';

import { useEffect } from 'react';

import { KIT_PREVIEW_HEIGHT } from '@/lib/kits/preview-frame';
import {
  FRAME_PREVIEW_STYLE_ID,
  releaseFramePreviewScrollLock,
} from '@/lib/kits/frame-preview-scroll-lock';

function hideNextDevToolbar() {
  document.querySelectorAll('nextjs-portal').forEach((portal) => {
    portal.style.setProperty('display', 'none', 'important');
  });
}

/** Suppress scrollbars and Next.js dev toolbar inside `?frame=1` embeds. */
export function TemplateFramePreviewLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevBodyHeight = body.style.height;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    html.style.height = `${KIT_PREVIEW_HEIGHT}px`;
    body.style.height = `${KIT_PREVIEW_HEIGHT}px`;

    hideNextDevToolbar();

    let styleEl = document.getElementById(
      FRAME_PREVIEW_STYLE_ID,
    ) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = FRAME_PREVIEW_STYLE_ID;
      styleEl.textContent = `
        html, body {
          overflow: hidden !important;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        nextjs-portal {
          display: none !important;
        }
      `;
      document.head.appendChild(styleEl);
    }

    const devToolsObserver = new MutationObserver(() => {
      hideNextDevToolbar();
    });
    devToolsObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.height = prevHtmlHeight;
      body.style.height = prevBodyHeight;
      devToolsObserver.disconnect();
      releaseFramePreviewScrollLock();
      document.querySelectorAll('nextjs-portal').forEach((portal) => {
        portal.style.removeProperty('display');
      });
    };
  }, []);

  return null;
}
