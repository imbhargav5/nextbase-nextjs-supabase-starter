import { FaqPageJsonLd } from '@/components/seo/structured-data';
import { HomeFaqAccordion } from '@/components/marketing/home/home-faq-accordion';

const faqItems = [
  {
    question: 'What is Prompt Market?',
    answer:
      'Prompt Market sells prompt packs with ship-ready Next.js templates. Paste a prompt into your coding agent, run the dev server, and get a marketing page in a real repo, not a static HTML mockup.',
  },
  {
    question: 'What is in a kit?',
    answer:
      'Each kit includes section prompts (hero, features, pricing, FAQ, and more), stack guardrails for Next.js and shadcn/ui, a full-page template demo, and ship prompts to wire routes, metadata, and deploy.',
  },
  {
    question: 'Who is Prompt Market for?',
    answer:
      'Founders, freelancers, and agencies who want a landing page that runs in git. You get structure and copy direction without agency fees or endless chat retries.',
  },
  {
    question: 'Do kits include live demos?',
    answer:
      'Yes. Every kit page links to live demos. Visit /prompts for product ideas (booking SaaS, creator CRM, wedding photography, and more) and prompts to rebrand the template for that business.',
  },
  {
    question: 'How do I get a kit after purchase?',
    answer:
      'Checkout and gated delivery are rolling out next. Kits will unlock in your account with copy-ready agent prompts and template access. Sign up now to get notified when checkout goes live.',
  },
];

export function HomeFaq() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-brand/15 bg-muted/10 px-4 py-20 sm:px-6 lg:px-8"
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
            What buyers ask before picking a kit.
          </p>
        </div>
        <HomeFaqAccordion items={faqItems} />
      </div>
    </section>
  );
}
