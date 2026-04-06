import { request, type Page } from '@playwright/test';

const INBUCKET_URL = 'http://localhost:54324';

interface InbucketMessage {
  ID: string;
  Created: string;
}

interface InbucketMessageDetail {
  Text: string;
}

async function getLatestEmailForAddress(emailAddress: string): Promise<InbucketMessageDetail | null> {
  const mailbox = emailAddress.split('@')[0];
  const requestContext = await request.newContext();

  try {
    for (let i = 0; i < 20; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await requestContext
        .get(`${INBUCKET_URL}/api/v1/search?query=${mailbox}&limit=20`)
        .catch(() => null);
      if (!response?.ok()) continue;

      const body = (await response.json().catch(() => null)) as
        | { messages?: InbucketMessage[] }
        | null;
      const messages = body?.messages ?? [];
      if (!messages.length) continue;

      const latest = [...messages].sort(
        (a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime()
      )[0];
      const detailResponse = await requestContext
        .get(`${INBUCKET_URL}/api/v1/message/${latest.ID}`)
        .catch(() => null);
      if (!detailResponse?.ok()) continue;

      const detail = (await detailResponse.json().catch(() => null)) as
        | InbucketMessageDetail
        | null;
      if (detail?.Text) {
        return detail;
      }
    }
    return null;
  } finally {
    await requestContext.dispose();
  }
}

function extractConfirmationLink(text: string, siteURL: string): string | null {
  const patterns = [
    /Log In \( (.+) \)/i,
    /(https?:\/\/127\.0\.0\.1[^\s"<]+)/i,
    /(https?:\/\/localhost[^\s"<]+)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;

    const link = new URL(match[1]);
    link.searchParams.set('redirect_to', new URL('/auth/callback', siteURL).toString());
    return link.toString();
  }
  return null;
}

export async function loginUserHelper({
  page,
  emailAddress,
}: {
  page: Page;
  emailAddress: string;
}): Promise<void> {
  await page.goto('/login');
  await page.getByRole('tab', { name: 'Magic Link' }).click();
  await page.getByPlaceholder(/email/i).fill(emailAddress);
  await page.getByRole('button', { name: /send magic link|sign in/i }).click();

  const emailDetail = await getLatestEmailForAddress(emailAddress);
  if (!emailDetail) throw new Error('No login email received');

  const link = extractConfirmationLink(emailDetail.Text, page.url());
  if (!link) throw new Error('Could not find login link in email');

  await page.goto(link);
  await page.waitForURL(/dashboard|app/, { timeout: 30000 });
}
