import { portfolioLaunchKitPrompts } from '@/lib/kits/prompts/portfolio-launch-kit';
import { saasLaunchKitPrompts } from '@/lib/kits/prompts/saas-launch-kit';
import type { KitPrompt } from '@/lib/kits/prompts/types';

const promptsByKitSlug: Record<string, KitPrompt[]> = {
  'saas-launch-kit': saasLaunchKitPrompts,
  'portfolio-launch-kit': portfolioLaunchKitPrompts,
};

export type { KitPrompt } from '@/lib/kits/prompts/types';

export function getKitPromptsBySlug(slug: string): KitPrompt[] | null {
  return promptsByKitSlug[slug] ?? null;
}

export function getKitPromptById(
  kitSlug: string,
  promptId: string,
): KitPrompt | null {
  const prompts = getKitPromptsBySlug(kitSlug);
  if (!prompts) {
    return null;
  }
  return prompts.find((prompt) => prompt.id === promptId) ?? null;
}
