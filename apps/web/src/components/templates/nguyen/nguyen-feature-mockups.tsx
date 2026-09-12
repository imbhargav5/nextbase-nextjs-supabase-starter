'use client';

import {
  ArrowUp,
  ChevronDown,
  Infinity,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

import {
  nguyenBenchmarkModels,
  nguyenChatMessage,
  nguyenIntegrationModels,
  nguyenKanbanColumns,
  nguyenWorkflowHeatmap,
} from './data';

const stripeBackground = {
  backgroundImage:
    'repeating-linear-gradient(-45deg, rgb(161,161,170) 0, rgb(161,161,170) 1px, transparent 0, transparent 8px)',
};

const heatmapCellClasses = [
  'bg-neutral-100 dark:bg-neutral-800',
  'bg-blue-100 dark:bg-blue-900/40',
  'bg-blue-200 dark:bg-blue-700/50',
  'bg-blue-300/80 dark:bg-blue-500/60',
  'bg-blue-400/70 dark:bg-blue-400/80',
] as const;

function AssigneeBadge({
  initials,
  name,
  className,
}: {
  initials: string;
  name: string;
  className?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          'flex h-4 w-4 items-center justify-center rounded-full text-[6px] font-bold text-white',
          className,
        )}
      >
        {initials}
      </div>
      <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
        {name}
      </span>
    </div>
  );
}

function TaskLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" />
      <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">
        {label}
      </span>
    </div>
  );
}

export function KanbanMockup() {
  return (
    <div className="relative w-full overflow-hidden px-4 pt-16 pb-4">
      <div
        aria-hidden="true"
        className="mx-auto grid w-full max-w-[360px] grid-cols-2 gap-2"
        style={{
          maskImage: 'linear-gradient(to bottom, black 58%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 58%, transparent 100%)',
        }}
      >
        {nguyenKanbanColumns.map((column, columnIndex) => (
          <div
            key={column.name}
            className="flex flex-col gap-2 rounded-xl border border-neutral-200 p-1.5 dark:border-neutral-700"
          >
            <p className="px-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              {column.name}
            </p>

            {column.tasks.map((task, taskIndex) => {
              const isStacked = 'stacked' in task && task.stacked;

              if (isStacked) {
                return (
                  <div
                    key={task.title}
                    className="group/task relative h-[108px] shrink-0 rounded-xl ring-1 ring-neutral-200 dark:ring-neutral-700"
                  >
                    <div
                      className="absolute inset-0 opacity-[0.18]"
                      style={stripeBackground}
                    />
                    <motion.div
                      initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
                      whileInView={{
                        opacity: 1,
                        x: 11,
                        y: 11,
                        rotate: 3.5,
                      }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        duration: 0.55,
                        delay: columnIndex * 0.08 + taskIndex * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={{ y: 6, rotate: 1.5, scale: 1.01 }}
                      className="absolute inset-0 z-10 flex h-[108px] flex-col justify-between rounded-xl bg-white p-3 shadow-xl shadow-black/20 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-700"
                    >
                      <div className="space-y-1">
                        <TaskLabel label={task.label} />
                        <p className="text-[11px] font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                          {task.title}
                        </p>
                      </div>
                      <AssigneeBadge
                        initials={task.assignee.initials}
                        name={task.assignee.name}
                        className={task.assignee.color}
                      />
                    </motion.div>
                  </div>
                );
              }

              return (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: 0.12 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="flex h-[108px] shrink-0 flex-col justify-between rounded-xl bg-white p-3 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-700"
                >
                  <div className="space-y-1">
                    <TaskLabel label={task.label} />
                    <p className="text-[11px] font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
                      {task.title}
                    </p>
                  </div>
                  <AssigneeBadge
                    initials={task.assignee.initials}
                    name={task.assignee.name}
                    className={task.assignee.color}
                  />
                </motion.div>
              );
            })}

            {'placeholder' in column && column.placeholder ? (
              <div className="relative flex h-[108px] shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-neutral-300/40 dark:ring-neutral-600/40">
                <div
                  className="absolute inset-0 opacity-[0.15]"
                  style={stripeBackground}
                />
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200/60 ring-1 ring-neutral-300/40 dark:bg-neutral-700/60 dark:ring-neutral-600/40">
                  <Plus
                    className="h-4 w-4 text-neutral-500"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="absolute right-0 bottom-0 left-0 h-12 bg-gradient-to-t from-card to-transparent" />
    </div>
  );
}

export function ChatMockup() {
  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden px-4 py-4">
      <div className="relative flex w-full max-w-[380px] items-start justify-end gap-1">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 0.6, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mt-6 hidden w-[100px] shrink-0 rounded-xl sm:block"
        >
          <div className="mb-3 h-14 w-full rounded-lg bg-neutral-200/50 dark:bg-neutral-700/50" />
          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded bg-neutral-200/60 dark:bg-neutral-700/60" />
            <div className="h-1.5 w-4/5 rounded bg-neutral-200/60 dark:bg-neutral-700/60" />
            <div className="h-1.5 w-3/5 rounded bg-neutral-200/50 dark:bg-neutral-700/50" />
            <div className="h-1.5 w-full rounded bg-neutral-200/40 dark:bg-neutral-700/40" />
            <div className="h-1.5 w-2/3 rounded bg-neutral-200/40 dark:bg-neutral-700/40" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-1.5 hidden shrink-0 cursor-pointer rounded-r-full rounded-t-full p-1.5 shadow-md sm:block"
        >
          <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-blue-400 text-[8px] font-bold text-white ring-1 ring-white/20">
            {nguyenChatMessage.initials}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          whileHover={{ scale: 1.01 }}
          className="relative mt-6 w-full max-w-[250px] origin-top-left rounded-2xl bg-white shadow-lg ring-1 ring-neutral-200/60 dark:bg-neutral-900 dark:ring-neutral-700/60"
        >
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full"
          >
            <X className="h-3 w-3 text-neutral-400 dark:text-neutral-500" />
          </span>

          <div className="grid grid-cols-[auto_1fr] gap-2.5 px-4 pt-4 pb-3.5">
            <div className="relative mt-px">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-[9px] font-semibold text-white">
                {nguyenChatMessage.initials}
              </div>
              <span className="absolute -right-px -bottom-px h-2 w-2 rounded-full bg-emerald-400 ring-[1.5px] ring-white dark:ring-neutral-900" />
            </div>
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100">
                  {nguyenChatMessage.author}
                </span>
                <span className="text-[10px] tabular-nums text-neutral-400 dark:text-neutral-500">
                  {nguyenChatMessage.time}
                </span>
              </div>
              <p className="mt-0.5 text-[13px] leading-[1.45] text-neutral-500 dark:text-neutral-400">
                {nguyenChatMessage.message}
              </p>
            </div>
          </div>

          <div className="group/reply flex items-center gap-2 border-t border-neutral-100 px-3 py-2.5 dark:border-neutral-800">
            <span className="flex-1 text-[12px] text-neutral-300 transition-colors group-hover/reply:text-neutral-400 dark:text-neutral-600 dark:group-hover/reply:text-neutral-500">
              Reply to Maya...
            </span>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 transition-transform group-hover/reply:scale-110 dark:bg-white">
              <ArrowUp className="h-3 w-3 text-white dark:text-neutral-900" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function BenchmarkMockup() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden px-10 py-3"
    >
      <div className="relative w-full">
        <div className="flex flex-col gap-4" style={{ perspective: '100px' }}>
          {nguyenBenchmarkModels.map((model, index) => (
            <motion.div
              key={model.name}
              style={{ transform: `rotateX(${4 - index}px)` }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={cn(index === 0 && '-mb-10 ml-auto mr-4 max-w-[calc(100%-4rem)]')}
            >
              <div
                className={cn(
                  'flex flex-col gap-2.5 rounded-xl bg-white px-4 py-3 shadow-xl shadow-black/10 ring-1 ring-neutral-200/60 dark:bg-neutral-900 dark:ring-neutral-700/60',
                  index > 0 &&
                    'overflow-hidden rounded-2xl shadow-md ring-neutral-200/70 dark:ring-neutral-700/60',
                )}
              >
                {index === 0 ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Sparkles
                        className="h-3 w-3 text-blue-400"
                        aria-hidden="true"
                      />
                      <span className="text-[11px] font-medium text-neutral-900 dark:text-neutral-100">
                        {model.name}
                      </span>
                      <span className="ml-auto text-[10px] text-neutral-400 dark:text-neutral-500">
                        {model.duration}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {[100, 85, 60].map((width) => (
                        <motion.div
                          key={width}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.55, delay: 0.15 }}
                          style={{ width: `${width}%` }}
                          className="h-1.5 origin-left rounded-full bg-neutral-200/80 dark:bg-neutral-700/80"
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: 0.2 }}
                          style={{ width: `${model.score}%` }}
                          className="h-full origin-left rounded-full bg-blue-400/60"
                        />
                      </div>
                      <span className="text-[10px] tabular-nums text-blue-500/80">
                        {model.score}%
                      </span>
                    </div>
                  </>
                ) : index === 1 ? (
                  <>
                    <div className="flex items-center gap-1 px-4 py-3">
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        Ask anything...
                      </span>
                      <span className="ml-px text-[11px] leading-none text-neutral-500 dark:text-neutral-400">
                        ▌
                      </span>
                    </div>
                    <div className="mx-3 border-t border-neutral-100 dark:border-neutral-800" />
                    <div className="flex items-center justify-between px-2.5 py-2">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1 rounded-lg bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                          <Infinity className="h-2.5 w-2.5 shrink-0" />
                          <span>Think</span>
                        </div>
                        <div className="flex items-center gap-0.5 rounded-lg bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                          <span>{model.name}</span>
                          <ChevronDown className="h-2.5 w-2.5 opacity-50" />
                        </div>
                      </div>
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-900 dark:bg-white">
                        <ArrowUp className="h-3 w-3 text-white dark:text-neutral-900" />
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IntegrationsMockup() {
  return (
    <div
      aria-hidden="true"
      className="relative flex w-full items-center justify-center overflow-hidden py-3"
      style={{
        maskImage:
          'linear-gradient(to right, black, black 75%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, black, black 75%, transparent 100%)',
      }}
    >
      <div className="relative w-full max-w-[240px]">
        <div className="flex flex-col items-center gap-3" style={{ perspective: '100px' }}>
          {nguyenIntegrationModels.map((model, index) => (
            <motion.div
              key={model.name}
              initial={{
                opacity: model.opacity,
                rotateX: model.rotateX,
              }}
              whileInView={{
                opacity: model.opacity,
                rotateX: model.rotateX,
              }}
              whileHover={{ rotateX: 0, scale: 1.03, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.35 }}
              style={{
                transformOrigin: model.rotateX >= 0 ? 'bottom' : 'top',
              }}
              className="flex items-center gap-2.5"
            >
              <div
                className="h-4 w-4 rounded shadow-md"
                style={{
                  backgroundColor: model.color,
                  boxShadow: `0 2px 8px ${model.color}40`,
                }}
              />
              <span className="text-base">{model.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="absolute right-0 bottom-0 left-0 h-12 bg-gradient-to-t from-card to-transparent" />
    </div>
  );
}

export function WorkflowMockup() {
  const { stats, rows } = nguyenWorkflowHeatmap;

  return (
    <div
      aria-hidden="true"
      className="relative flex w-full justify-center overflow-hidden px-3 py-3"
      style={{
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, black 60%, transparent 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-[240px] rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-neutral-200/60 dark:bg-neutral-900 dark:ring-neutral-700/60"
      >
        <p className="mb-3 text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
          Workflow coverage
        </p>

        <div className="mb-3.5 flex gap-4">
          <div>
            <p className="mb-0.5 text-[9px] leading-tight text-neutral-400 dark:text-neutral-500">
              All tasks covered
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {stats.allTasks.primary}%
              </span>
              <span className="rounded bg-neutral-100 px-1 py-px text-[9px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                {stats.allTasks.secondary}%
              </span>
            </div>
          </div>
          <div>
            <p className="mb-0.5 text-[9px] leading-tight text-neutral-400 dark:text-neutral-500">
              Best coverage
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {stats.bestCoverage.primary}%
              </span>
              <span className="rounded bg-neutral-100 px-1 py-px text-[9px] font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                {stats.bestCoverage.secondary}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {rows.map((row) => (
            <div key={row.day} className="flex items-center gap-1.5">
              <span className="w-5 shrink-0 text-[8px] text-neutral-400 dark:text-neutral-500">
                {row.day}
              </span>
              <div className="grid flex-1 grid-cols-[repeat(13,minmax(0,1fr))] gap-[3px]">
                {row.cells.map((cell, cellIndex) => (
                  <motion.div
                    key={`${row.day}-${cellIndex}`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.25,
                      delay: cellIndex * 0.015,
                    }}
                    whileHover={{ scale: 1.15 }}
                    className={cn(
                      'aspect-square w-full rounded-[2px]',
                      heatmapCellClasses[cell],
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
