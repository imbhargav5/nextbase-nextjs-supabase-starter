import { KitTemplateExplorer } from '@/components/marketing/kits/kit-template-explorer';
import type { KitProduct } from '@/lib/kits/catalog';

interface KitTemplatePagesProps {
  kit: KitProduct;
  isOwned?: boolean;
}

export function KitTemplatePages({ kit, isOwned }: KitTemplatePagesProps) {
  return <KitTemplateExplorer kit={kit} isOwned={isOwned} />;
}
