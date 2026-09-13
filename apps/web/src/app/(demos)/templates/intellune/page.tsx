import { IntelluneTemplate } from '@/components/templates/intellune';
import { getTemplateBySlug } from '@/lib/templates/catalog';

const template = getTemplateBySlug('intellune');

export const metadata = {
  title: template?.name ?? 'Intellune',
  description:
    template?.description ??
    'Scaffold slot for your next landing page template in the marketplace.',
};

export default function IntelluneTemplatePage() {
  return <IntelluneTemplate />;
}
