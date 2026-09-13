import 'server-only';

const priceEnvByKitSlug: Record<string, string> = {
  'saas-launch-kit': 'STRIPE_PRICE_SAAS_LAUNCH_KIT',
  'portfolio-launch-kit': 'STRIPE_PRICE_PORTFOLIO_LAUNCH_KIT',
};

export function getKitStripePriceId(kitSlug: string): string | null {
  const envKey = priceEnvByKitSlug[kitSlug];
  if (!envKey) {
    return null;
  }

  return process.env[envKey] ?? null;
}
