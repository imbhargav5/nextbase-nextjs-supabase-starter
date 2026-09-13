import { notFound } from 'next/navigation';

import { SmithCaseStudyPage } from '@/components/templates/smith/smith-case-study-page';
import {
  getSmithCaseStudy,
  smithCaseStudies,
} from '@/components/templates/smith/constants';

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(smithCaseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const study = getSmithCaseStudy(slug);

  if (!study) {
    return {
      title: 'Case study: Smith',
      description: 'Project case study for the Smith portfolio template.',
    };
  }

  return {
    title: `${study.title}: Smith`,
    description: `Case study for ${study.title}: challenge, approach, and outcomes.`,
  };
}

export default async function SmithCaseStudyRoute({ params }: CaseStudyPageProps) {
  const { slug } = await params;

  if (!getSmithCaseStudy(slug)) {
    notFound();
  }

  return <SmithCaseStudyPage slug={slug} />;
}
