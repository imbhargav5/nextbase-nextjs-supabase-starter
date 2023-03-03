export const ADMIN_USER_LIST_VIEW_PAGE_SIZE = 10;
export const ADMIN_ORGANIZATION_LIST_VIEW_PAGE_SIZE = 10;
export const PRODUCT_NAME = 'SuperTranslate';
export const APP_NAME = 'supertranslate';
export const GOOGLE_ANALYTICS_ID = 's';
export const MAX_CONTENT_WIDTH = 700;
export const MAX_VIDEO_LENGTH_SEC = 60 * 120; // 120 minutes
export const MAX_VIDEO_SIZE_MB = 1024 * 1.5; // 1.5 GB
export const MAX_VIDEO_NAME_LENGTH = 300;
export const AWS_BUCKET_INPUT = 'ai-dubbing-input-bucket';
export const AWS_BUCKET_INPUT_MP3 = 'ai-dubbing-input-mp3';
export const AWS_BUCKET_OUTPUT_SUBTITLES = 'ai-dubbing-output-bucket';
export const AWS_BUCKET_OUTPUT_VIDEOS = 'ai-dubbing-output-mp4';
export const MAX_FILE_DOWNLOAD_LINK_EXPIRY_TIME_SECS = 60 * 5;
export const COLOR_PRIMARY = '#0383e3';
export const MAX_SUBTITLE_STRING_LENGTH = 100000;
export const ID_VIDEO_PLAYER_EDIT_SUBTITLES = 'video-player-subtitles-edit';
export const ID_PORTAL_SUBTITLES_EDIT = 'portal-video-subtitle-edit';
export const KEY_LOCAL_STORAGE_MODIFIED_SUBTITLES = (runId: string): string =>
  'key-ls-modified-subtitles-edit-' + runId;
export const ID_DOM_SUBTITLE_EDITOR_TEXT_BOX = (identifier: number): string =>
  `id_dom_subtitle_boxes_${identifier}`;
export const MAX_QUESTGEN_RUNS = 3;
export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
