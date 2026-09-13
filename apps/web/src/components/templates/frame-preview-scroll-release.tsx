'use client';

import { useEffect } from 'react';

import { releaseFramePreviewScrollLock } from '@/lib/kits/frame-preview-scroll-lock';

/** Ensures kit iframe scroll lock does not persist on full template routes. */
export function FramePreviewScrollRelease() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('frame') === '1') {
      return;
    }
    releaseFramePreviewScrollLock();
  }, []);

  return null;
}
