import 'server-only';

import { toSiteURL } from '@/utils/helpers';

/** Server-side magic link verify (sets auth cookies), then redirects to `redirectPath`. */
export function buildMagicLinkConfirmUrl(
  hashedToken: string,
  redirectPath: string,
): string {
  const url = new URL(toSiteURL('/auth/confirm'));
  url.searchParams.set('token_hash', hashedToken);
  url.searchParams.set('next', redirectPath);
  return url.toString();
}
