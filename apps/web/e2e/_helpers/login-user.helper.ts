import type { Page } from '@playwright/test';

const INBUCKET_URL = 'http://localhost:54324';

interface InbucketMessage {
  id: string;
  subject: string;
}

interface InbucketMessageDetail {
  body: {
    text: string;
    html?: string;
  };
}

async function getLatestEmailForAddress(emailAddress: string): Promise<InbucketMessageDetail | null> {
  const mailbox = emailAddress.split('@')[0];
  const messagesUrl = `${INBUCKET_URL}/api/v1/mailbox/${mailbox}`;

  for (let i = 0; i < 20; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const res = await fetch(messagesUrl).catch(() => null);
    if (!res) continue;
    const messages: InbucketMessage[] = await res.json().catch(() => []);
    if (messages.length > 0) {
      const latest = messages[messages.length - 1];
      const detailRes = await fetch(`${INBUCKET_URL}/api/v1/mailbox/${mailbox}/${latest.id}`).catch(() => null);
      if (!detailRes) continue;
      return detailRes.json().catch(() => null);
    }
  }
  return null;
}

function extractConfirmationLink(text: string): string | null {
  const patterns = [
    /(https?:\/\/localhost[^\s"<]+confirm[^\s"<]+)/i,
    /(https?:\/\/localhost[^\s"<]+magic[^\s"<]+)/i,
    /(https?:\/\/localhost[^\s"<]+)/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
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

  const link = extractConfirmationLink(emailDetail.body.text);
  if (!link) throw new Error('Could not find login link in email');

  await page.goto(link);
  await page.waitForURL(/dashboard|app/, { timeout: 30000 });
}
