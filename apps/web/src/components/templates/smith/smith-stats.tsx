'use client';

import { motion } from 'motion/react';

import { smithStats } from '@/components/templates/smith/constants';
import { smithDisplayClass } from '@/components/templates/smith/smith-theme-provider';

export function SmithStats() {
  return (
    <section
      id="resume"
      className="bg-[hsl(var(--smith-bg))] py-16 md:py-24"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 md:grid-cols-3 md:px-10 lg:px-16">
        {smithStats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <p
              className={`text-5xl text-[hsl(var(--smith-text))] md:text-6xl ${smithDisplayClass()}`}
            >
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-[hsl(var(--smith-muted))]">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
