'use client';

import { type ReactNode } from 'react';
import { motion, type Variants } from 'motion/react';

import { cn } from '@/lib/utils';

import { nguyenFeatureCards, nguyenFeaturesSection } from './data';
import {
  BenchmarkMockup,
  ChatMockup,
  IntegrationsMockup,
  KanbanMockup,
  WorkflowMockup,
} from './nguyen-feature-mockups';

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.08,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

function FeatureCard({
  index,
  className,
  minHeight,
  children,
  title,
  description,
}: {
  index: number;
  className?: string;
  minHeight?: string;
  children: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -80px 0px' }}
      variants={fadeUpVariants}
      className={className}
    >
      <article
        className={cn(
          'group relative flex h-full flex-col overflow-hidden rounded-md border bg-card transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5',
          minHeight,
        )}
      >
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/50">
          {children}
        </div>
        <div className="px-5 py-4">
          <h3 className="text-lg leading-relaxed font-medium tracking-tight text-foreground">
            <span>{title}</span>
            <span className="text-muted-foreground/50"> {description}</span>
          </h3>
        </div>
      </article>
    </motion.div>
  );
}

const mockupByFeatureId = {
  'visual-task-management': KanbanMockup,
  'team-chat': ChatMockup,
  'ai-benchmarks': BenchmarkMockup,
  'multi-model': IntegrationsMockup,
  'automated-workflows': WorkflowMockup,
} as const;

export function NguyenFeatures() {
  return (
    <section id="features" className="relative px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            {nguyenFeaturesSection.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="text-lg leading-relaxed text-muted-foreground md:pt-2"
          >
            {nguyenFeaturesSection.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-6">
          {nguyenFeatureCards.map((card, index) => {
            const Mockup = mockupByFeatureId[card.id];

            return (
              <FeatureCard
                key={card.id}
                index={index}
                title={card.title}
                description={card.description}
                minHeight={card.minHeight}
                className={card.colSpan}
              >
                <Mockup />
              </FeatureCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
