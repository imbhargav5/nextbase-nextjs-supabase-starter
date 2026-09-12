'use client';

import { Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Testimonial {
  title: string;
  quote: string;
  name: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    title: 'Game-changing for our startup',
    quote:
      'Nguyen helped us ship our product 3x faster. The collaboration tools are incredible and our team has never been more aligned.',
    name: 'Giana Herwitz',
    date: 'Mar 15',
  },
  {
    title: 'Best investment we made',
    quote:
      "Since switching to Nguyen, our team's productivity increased by 40%. The analytics dashboard alone is worth the price.",
    name: 'Marcus Johnson',
    date: 'Apr 2',
  },
  {
    title: 'Simple yet powerful',
    quote:
      'I love how easy it is to manage everything from one dashboard. Nguyen keeps it simple but incredibly powerful.',
    name: 'Kaiya Donin',
    date: 'Apr 18',
  },
  {
    title: 'Perfect for remote teams',
    quote:
      "With our team spread across 5 countries, Nguyen keeps everyone connected and productive. Couldn't imagine working without it.",
    name: 'Alex Chen',
    date: 'May 4',
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article
      className="w-xs shrink-0 rounded-xl bg-card p-7 shadow-md md:w-[24rem]"
      aria-label={`Testimonial from ${testimonial.name}`}
    >
      <div className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="size-4 fill-primary text-primary" />
        ))}
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">
        {testimonial.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <footer className="mt-6 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{testimonial.name}</span>
        <time className="text-muted-foreground">{testimonial.date}</time>
      </footer>
    </article>
  );
}

function TestimonialMarqueeRow({
  direction,
  ariaHidden,
}: {
  direction: 'left' | 'right';
  ariaHidden?: boolean;
}) {
  const items = [...testimonials, ...testimonials];

  return (
    <div
      className="nguyen-marquee-fade relative overflow-hidden"
      aria-hidden={ariaHidden}
    >
      <div
        className={cn(
          'flex w-max gap-4 py-2 [--duration:40s] [--gap:1rem] motion-reduce:animate-none',
          direction === 'left'
            ? 'animate-marquee'
            : '[animation-direction:reverse] animate-marquee',
        )}
      >
        {items.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.name}-${index}`}
            testimonial={testimonial}
          />
        ))}
      </div>
    </div>
  );
}

export function NguyenTestimonials() {
  return (
    <section
      id="testimonials"
      className="overflow-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      aria-labelledby="nguyen-testimonials-heading"
    >
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1">
          Testimonial
        </Badge>
        <h2
          id="nguyen-testimonials-heading"
          className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
        >
          Don&apos;t Take{' '}
          <span className="text-muted-foreground">Our Word for It</span>
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Join thousands of teams who have transformed their workflow and
          boosted productivity with Nguyen.
        </p>
      </div>

      <div className="space-y-4">
        <TestimonialMarqueeRow direction="left" />
        <TestimonialMarqueeRow direction="right" ariaHidden />
      </div>
    </section>
  );
}
