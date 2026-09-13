// Built using Hyperiux Vault: https://vault.hyperiux.com

'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

import {
  ArrowUpRightIcon,
  type ArrowUpRightIconHandle,
} from '@/components/icons/arrow-up-right';
import { cn } from '@/lib/utils';

type CSSVars = CSSProperties & Record<string, string | number | undefined>;

export interface HoverStackCard {
  id?: number;
  quote: string;
  tag?: string;
  bg: string;
  accent?: string;
}

interface PreparedHoverStackCard extends HoverStackCard {
  _rotation: number;
  _baseX: number;
  _baseZ: number;
}

export interface HoverStackProps {
  cards?: HoverStackCard[];
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  hoverLift?: number;
  pushDistance?: number;
  spread?: number;
  rotation?: number;
  duration?: number;
  accentColor?: string;
  className?: string;
}

const PRESET_ROTATIONS = [-6, 3, -2, 4, -3, 5, 2, -4, 1, -3];

function CardFooter({
  index,
  tag,
  isHighlighted = false,
}: {
  index: number;
  tag?: string;
  isHighlighted?: boolean;
}) {
  const arrowRef = useRef<ArrowUpRightIconHandle>(null);

  useEffect(() => {
    if (isHighlighted) {
      void arrowRef.current?.startAnimation();
      return;
    }
    void arrowRef.current?.stopAnimation();
  }, [isHighlighted]);

  return (
    <div className="relative z-[2] flex flex-col gap-4">
      <div className="h-px w-full bg-border/60" />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-[color,background-color,border-color,box-shadow] duration-300',
              isHighlighted
                ? 'border-brand/60 bg-brand text-brand-foreground shadow-[0_6px_16px_-6px_color-mix(in_oklch,var(--brand)_45%,transparent)]'
                : 'border-border/70 bg-background/80 text-foreground',
            )}
            aria-hidden="true"
          >
            <ArrowUpRightIcon
              ref={arrowRef}
              aria-hidden
              size={14}
              strokeWidth={isHighlighted ? 3 : 2}
              animateOnGroupHover={false}
              className="[&_svg]:transition-[stroke-width] [&_svg]:duration-300"
            />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {tag ?? 'Feature'}
          </span>
        </div>
        <span className="text-[11px] font-medium tabular-nums tracking-[0.14em] text-muted-foreground/70">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

export function HoverStack({
  cards,
  cardWidth = 280,
  cardHeight = 360,
  overlap = 96,
  hoverLift = 28,
  pushDistance = 220,
  spread = 20,
  rotation = 5,
  duration = 0.5,
  accentColor = 'var(--ring)',
  className,
}: HoverStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [layoutScale, setLayoutScale] = useState(1);
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false),
  );

  useEffect(() => {
    setHasMounted(true);
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;

    const onChange = (event: MediaQueryListEvent) => {
      setReduceMotion(event.matches);
      if (event.matches) setActiveIndex(null);
    };

    setReduceMotion(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const preparedCards: PreparedHoverStackCard[] = useMemo(() => {
    const rotationScale = rotation / 5;

    return (cards ?? []).map((card, index) => {
      const presetRotation =
        PRESET_ROTATIONS[index % PRESET_ROTATIONS.length] + (index % 2 === 0 ? 0 : 0.5);

      return {
        ...card,
        _rotation: presetRotation * rotationScale,
        _baseX: index * overlap,
        _baseZ: index + 1,
      };
    });
  }, [cards, overlap, rotation]);

  const getCardStyle = (card: PreparedHoverStackCard, index: number): CSSVars => {
    const isActive = activeIndex === index;
    const hasActive = activeIndex !== null;

    let x = card._baseX;
    let y = 0;
    let rotate = card._rotation;
    let zIndex = card._baseZ;
    let scale = 1;
    let boxShadow: string | undefined;

    if (reduceMotion) {
      if (isActive) zIndex = 999;

      return {
        '--card-width': `${cardWidth}px`,
        '--card-height': `${cardHeight}px`,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(1)`,
        zIndex,
        transition: 'none',
        background: card.bg,
      };
    }

    if (hasActive) {
      if (index < activeIndex!) {
        x -= pushDistance;
        y -= spread * 0.4;
      } else if (index > activeIndex!) {
        x += pushDistance;
        y += spread * 0.4;
      }

      if (isActive) {
        x = card._baseX;
        y = -hoverLift;
        rotate = 0;
        zIndex = 999;
        scale = 1.02;
        boxShadow =
          '0 24px 48px -12px color-mix(in oklch, var(--foreground) 12%, transparent)';
      }
    }

    const activeMs = Math.max(0, duration) * 1000;
    const transition = isActive
      ? `transform ${activeMs}ms cubic-bezier(0.22, 1.6, 0.32, 1), box-shadow ${activeMs * (900 / 700)}ms cubic-bezier(0.22, 1.6, 0.32, 1)`
      : hasActive
        ? `transform ${activeMs}ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow ${activeMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
        : `transform ${activeMs * (480 / 700)}ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow ${activeMs * (380 / 700)}ms cubic-bezier(0.4, 0, 0.2, 1)`;

    return {
      '--card-width': `${cardWidth}px`,
      '--card-height': `${cardHeight}px`,
      transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
      zIndex,
      transition,
      background: card.bg,
      boxShadow,
    };
  };

  const handleActivate = (index: number) => setActiveIndex(index);
  const handleDeactivate = () => setActiveIndex(null);

  const totalWidth =
    preparedCards.length > 0 ? preparedCards.at(-1)!._baseX + cardWidth : cardWidth;

  const maxRotationRad = (Math.max(...PRESET_ROTATIONS.map(Math.abs)) * (rotation / 5) * Math.PI) / 180;
  const rotationOverflow =
    (cardHeight / 2) * (1 - Math.cos(maxRotationRad)) +
    (cardWidth / 2) * Math.sin(maxRotationRad);
  const topInset = Math.ceil(rotationOverflow + hoverLift + spread * 0.4 + 24);
  const bottomInset = 24;
  const stackHeight = cardHeight + topInset + bottomInset;
  const fanWidth = totalWidth + pushDistance * 2;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || isTouch) return;

    const updateScale = () => {
      const availableWidth = container.clientWidth;
      if (availableWidth <= 0) return;

      const nextScale = Math.min(1, availableWidth / fanWidth);
      setLayoutScale(nextScale);
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);

    return () => observer.disconnect();
  }, [fanWidth, isTouch]);

  if (!hasMounted || preparedCards.length === 0) {
    return null;
  }

  const cardBaseClassName =
    'group relative flex select-none flex-col justify-between overflow-hidden rounded-[1.25rem] border border-border/70 p-6 text-foreground shadow-sm';

  return (
    <div ref={containerRef} className={cn('relative w-full min-w-0 overflow-x-clip', className)}>
      {isTouch ? (
        <div className="flex flex-col gap-4">
          {preparedCards.map((card, index) => (
            <div
              key={card.id ?? index}
              className={cn(cardBaseClassName, 'min-h-[280px] w-full', card.accent)}
              style={{ background: card.bg }}
            >
              {card.tag ? (
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {card.tag}
                </p>
              ) : (
                <div />
              )}

              <div className="relative z-[2] flex flex-1 items-center py-6">
                <p className="m-0 max-w-full text-pretty text-xl leading-snug tracking-tight sm:text-2xl">
                  {card.quote}
                </p>
              </div>

              <CardFooter
                index={index}
                tag={card.tag}
                isHighlighted={activeIndex === index}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="relative mx-auto min-w-0 overflow-x-clip"
          style={{
            width: fanWidth * layoutScale,
            height: stackHeight * layoutScale,
          }}
        >
          <div
            className="absolute top-0 left-1/2 origin-top"
            style={
              {
                '--stack-width': `${totalWidth}px`,
                '--stack-height': `${stackHeight}px`,
                '--stack-top-inset': `${topInset}px`,
                width: `${fanWidth}px`,
                height: 'var(--stack-height)',
                transform: `translateX(-50%) scale(${layoutScale})`,
              } as CSSVars
            }
          >
            <div
              className="relative"
              style={{
                marginLeft: `${pushDistance}px`,
                width: 'var(--stack-width)',
                height: 'var(--stack-height)',
              }}
            >
          {preparedCards.map((card, index) => (
            <div
              key={card.id ?? index}
              role="button"
              tabIndex={0}
              aria-label={card.tag ? `${card.tag}: ${card.quote}` : card.quote}
              className={cn(
                cardBaseClassName,
                'absolute left-0 top-[var(--stack-top-inset)] h-[var(--card-height)] w-[var(--card-width)] origin-center cursor-default will-change-transform',
                card.accent,
              )}
              style={getCardStyle(card, index)}
              onMouseEnter={() => handleActivate(index)}
              onMouseLeave={handleDeactivate}
              onFocus={() => handleActivate(index)}
              onBlur={handleDeactivate}
            >
              {card.tag ? (
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {card.tag}
                </p>
              ) : (
                <div />
              )}

              <div className="relative z-[2] flex flex-1 items-center py-4">
                <p className="m-0 max-w-[95%] text-pretty text-[1.65rem] leading-[1.1] tracking-tight">
                  {card.quote}
                </p>
              </div>

              <CardFooter
                index={index}
                tag={card.tag}
                isHighlighted={activeIndex === index}
              />
            </div>
          ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
