import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FaqPageJsonLd } from '@/components/seo/structured-data';

const faqItems = [
  {
    question: 'What is Menace Next?',
    answer:
      'Menace Next is a commercial-grade SaaS starter kit built on Next.js 16 and Supabase. It includes authentication, row-level security, server actions, marketing pages, pricing UI, template marketplace demos, and SEO primitives so you can launch faster.',
  },
  {
    question: 'Who is Menace Next for?',
    answer:
      'Founders, agencies, and product teams who want a maintainable foundation instead of rebuilding auth, database policies, and marketing pages from scratch for every new SaaS.',
  },
  {
    question: 'Does Menace Next include billing?',
    answer:
      'The starter ships with pricing UI, checkout-ready layouts, and documentation hooks. Wire your payment provider (Stripe, Polar, Lemon Squeezy, etc.) using the same patterns as the rest of the app.',
  },
  {
    question: 'Can I customize branding and templates?',
    answer:
      'Yes. Swap logos, themes, and copy in minutes. The template marketplace includes full-page demos you can fork for landing pages, product marketing, or client deliverables.',
  },
  {
    question: 'Is Menace Next production-ready?',
    answer:
      'The stack follows SSR-safe Supabase auth, typed migrations, safe server actions, E2E tests, and cache-friendly Next.js patterns used in real SaaS products.',
  },
];

export function HomeFaq() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t bg-muted/10 px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="faq-heading"
    >
      <FaqPageJsonLd items={faqItems} />
      <div className="mx-auto max-w-3xl">
        <div className="space-y-3 text-center">
          <h2
            id="faq-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground">
            Everything buyers and developers ask before adopting a SaaS starter
            kit.
          </p>
        </div>
        <Accordion type="single" collapsible className="mt-10 w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-7">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
