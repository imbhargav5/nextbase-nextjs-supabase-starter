import { domToBlob } from 'modern-screenshot';

/**
 * Rasterizes the current page into a PNG blob. Cross-origin images that would
 * taint the canvas are skipped by modern-screenshot's fetch fallback; any hard
 * failure rejects so the caller can degrade gracefully.
 */
export async function captureScreenshot(
  target: HTMLElement = document.body
): Promise<Blob> {
  return domToBlob(target, {
    type: 'image/png',
    backgroundColor: '#ffffff',
    scale: Math.min(window.devicePixelRatio || 1, 2),
  });
}
