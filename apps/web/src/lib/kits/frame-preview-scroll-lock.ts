const FRAME_PREVIEW_STYLE_ID = 'template-frame-preview-lock';

/** Undo kit iframe scroll lock if it leaked onto a full-page visit. */
export function releaseFramePreviewScrollLock() {
  if (typeof document === 'undefined') {
    return;
  }

  document.getElementById(FRAME_PREVIEW_STYLE_ID)?.remove();
  document.documentElement.style.removeProperty('overflow');
  document.documentElement.style.removeProperty('height');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('height');
}

export { FRAME_PREVIEW_STYLE_ID };
