'use client';

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  UserGroupIcon,
  HierarchyIcon,
  UserIcon,
  RotateLeftIcon,
  Settings02Icon,
  CpuIcon,
  CodeIcon,
  Chart01Icon,
  FlashIcon,
  Link01Icon,
  SmartPhone01Icon,
  CloudIcon,
  DatabaseIcon,
  LockIcon,
} from '@hugeicons/core-free-icons';
import { motion, useMotionValue, useMotionTemplate } from 'motion/react';

import { cn } from '@/lib/utils';

const TAG_ROWS = [
  [
    { id: 'discovery', icon: Search01Icon, label: 'Discovery' },
    { id: 'client-review', icon: UserGroupIcon, label: 'Client Review' },
    { id: 'system-design', icon: HierarchyIcon, label: 'System Design' },
    { id: 'devops-integration', icon: UserIcon, label: 'DevOps Integration' },
    { id: 'post-launch', icon: RotateLeftIcon, label: 'Post-Launch Support' },
  ],
  [
    { id: 'qa-optimization', icon: Settings02Icon, label: 'QA & Optimization' },
    { id: 'launch-deploy', icon: CpuIcon, label: 'Launch & Deploy' },
    { id: 'full-stack', icon: CodeIcon, label: 'Full-Stack Development' },
    { id: 'analytics', icon: Chart01Icon, label: 'Analytics' },
    { id: 'mvp-engineering', icon: FlashIcon, label: 'MVP Engineering' },
  ],
  [
    { id: 'api-backend', icon: Link01Icon, label: 'API & Backend' },
    { id: 'mobile-dev', icon: SmartPhone01Icon, label: 'Mobile Development' },
    {
      id: 'cloud-infrastructure',
      icon: CloudIcon,
      label: 'Cloud Infrastructure',
    },
    { id: 'database-design', icon: DatabaseIcon, label: 'Database Design' },
    { id: 'security', icon: LockIcon, label: 'Security' },
  ],
];

const CONFIG = {
  title: 'Intelligent Workflows',
  description:
    "Automatically categorize and search through your team's diverse skillsets and project phases with contextual awareness.",
  lensSize: 72,
};

export function MagnifiedBento({ className }: { className?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const lensX = useMotionValue(0);
  const lensY = useMotionValue(0);

  const clipPath = useMotionTemplate`circle(24px at calc(50% + ${lensX}px - 8px) calc(50% + ${lensY}px - 8px))`;
  const inverseMask = useMotionTemplate`radial-gradient(circle 24px at calc(50% + ${lensX}px - 8px) calc(50% + ${lensY}px - 8px), transparent 100%, black 100%)`;

  return (
    <div
      className={cn(
        'group relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] border bg-card p-1.5 shadow-2xl shadow-primary/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-primary/10 sm:rounded-[2rem] sm:p-2',
        className,
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          'relative flex min-h-[148px] w-full flex-1 overflow-hidden rounded-[1.25rem] bg-muted/30 sm:min-h-[164px] sm:rounded-[1.5rem]',
        )}
      >
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <motion.div
            style={{ WebkitMaskImage: inverseMask, maskImage: inverseMask }}
            className="flex h-full w-full flex-col justify-center gap-2.5"
          >
            {TAG_ROWS.map((row, rowIndex) => (
              <motion.div
                key={`row-${rowIndex}`}
                className="flex w-max gap-3"
                animate={{
                  x: rowIndex % 2 === 0 ? ['0%', '-33.333%'] : ['-33.333%', '0%'],
                }}
                transition={{
                  duration: 25,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              >
                {[...row, ...row, ...row].map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    className="flex w-fit items-center gap-1.5 rounded-full border border-border/50 bg-background/50 p-1.5 px-2.5 text-[11px] whitespace-nowrap text-muted-foreground backdrop-blur-sm"
                  >
                    <HugeiconsIcon icon={item.icon} size={12} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center gap-2.5 select-none"
            style={{
              clipPath,
            }}
          >
            {TAG_ROWS.map((row, rowIndex) => (
              <motion.div
                key={`row-reveal-${rowIndex}`}
                className="flex w-max gap-3"
                animate={{
                  x: rowIndex % 2 === 0 ? ['0%', '-33.333%'] : ['-33.333%', '0%'],
                }}
                transition={{
                  duration: 25,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              >
                {[...row, ...row, ...row].map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}-reveal`}
                    className="ml-4 flex w-fit scale-110 items-center gap-1.5 rounded-full border border-primary/20 bg-background p-1.5 px-2.5 text-[11px] whitespace-nowrap text-foreground shadow-sm"
                  >
                    <HugeiconsIcon icon={item.icon} size={12} className="text-primary" />
                    <span className="font-medium text-primary">{item.label}</span>
                  </div>
                ))}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 cursor-grab drop-shadow-xl active:cursor-grabbing"
            drag
            dragMomentum={false}
            dragConstraints={containerRef}
            style={{ x: lensX, y: lensY }}
          >
            <div className="relative">
              <MagnifyingLens size={CONFIG.lensSize} />
              <div className="pointer-events-none absolute top-[5px] left-[5px] size-[46px] rounded-full bg-white/10" />
            </div>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/4 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-1/4 bg-linear-to-l from-background to-transparent" />
      </div>

      <div className="px-4 pt-3 pb-5 sm:px-5 sm:pb-6">
        <h3 className="text-lg font-medium tracking-tight text-foreground sm:text-xl">
          {CONFIG.title}
        </h3>
        <p className="mt-1.5 min-h-[3.5rem] text-sm leading-relaxed text-muted-foreground sm:min-h-[3.75rem]">
          {CONFIG.description}
        </p>
      </div>
    </div>
  );
}

function MagnifyingLens({ size = 92 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M365.424 335.392L342.24 312.192L311.68 342.736L334.88 365.936L365.424 335.392Z"
        fill="#B0BDC6"
      />
      <path
        d="M358.08 342.736L334.88 319.552L319.04 335.392L342.24 358.584L358.08 342.736Z"
        fill="#DFE9EF"
      />
      <path
        d="M352.368 321.808L342.752 312.192L312.208 342.752L321.824 352.36L352.368 321.808Z"
        fill="#B0BDC6"
      />
      <path
        d="M332 332C260 404 142.4 404 69.6001 332C-2.3999 260 -2.3999 142.4 69.6001 69.6C141.6 -3.20003 259.2 -2.40002 332 69.6C404.8 142.4 404.8 260 332 332ZM315.2 87.2C252 24 150.4 24 88.0001 87.2C24.8001 150.4 24.8001 252 88.0001 314.4C151.2 377.6 252.8 377.6 315.2 314.4C377.6 252 377.6 150.4 315.2 87.2Z"
        fill="#DFE9EF"
      />
      <path
        d="M319.2 319.2C254.4 384 148.8 384 83.2001 319.2C18.4001 254.4 18.4001 148.8 83.2001 83.2C148 18.4 253.6 18.4 319.2 83.2C384 148.8 384 254.4 319.2 319.2ZM310.4 92C250.4 32 152 32 92.0001 92C32.0001 152 32.0001 250.4 92.0001 310.4C152 370.4 250.4 370.4 310.4 310.4C370.4 250.4 370.4 152 310.4 92Z"
        fill="#7A858C"
      />
      <path
        d="M484.104 428.784L373.8 318.472L318.36 373.912L428.672 484.216L484.104 428.784Z"
        fill="#333333"
      />
      <path
        d="M471.664 441.224L361.344 330.928L330.8 361.48L441.12 471.76L471.664 441.224Z"
        fill="#575B5E"
      />
      <path
        d="M495.2 423.2C504 432 432.8 504 423.2 495.2L417.6 489.6C408.8 480.8 480 408.8 489.6 417.6L495.2 423.2Z"
        fill="#B0BDC6"
      />
      <path
        d="M483.2 435.2C492 444 444.8 492 435.2 483.2L429.6 477.6C420.8 468.8 468 420.8 477.6 429.6L483.2 435.2Z"
        fill="#DFE9EF"
      />
    </svg>
  );
}
