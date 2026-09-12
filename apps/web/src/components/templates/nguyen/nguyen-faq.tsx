'use client';

import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const faqItems = [
  {
    question: 'Is there a free trial available?',
    answer:
      'Yes! We offer a 14-day free trial with full access to all features. No credit card required to start.',
  },
  {
    question: 'How many team members can I add?',
    answer:
      'It depends on your plan. Starter includes up to 5 members, Professional offers unlimited members, and Enterprise provides custom limits based on your needs.',
  },
  {
    question: 'What integrations do you support?',
    answer:
      'We integrate with 100+ popular tools including Slack, GitHub, Jira, Notion, Figma, Google Workspace, and many more. We also offer a REST API for custom integrations.',
  },
  {
    question: 'How secure is my data?',
    answer:
      'Security is our top priority. We use enterprise-grade encryption, SOC 2 Type II compliance, and offer SSO for Enterprise plans. Your data is always protected.',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer:
      'Absolutely. You can cancel your subscription at any time with no questions asked. Your data will be available for export for 30 days after cancellation.',
  },
  {
    question: 'What kind of support do you offer?',
    answer:
      'All plans include email support. Professional plans get priority support with 4-hour response time. Enterprise plans include 24/7 dedicated support and a personal account manager.',
  },
  {
    question: 'Can you help us migrate from another tool?',
    answer:
      'Yes! We offer free migration assistance for Professional and Enterprise plans. Our team will help you import your data and get your team onboarded smoothly.',
  },
  {
    question: 'Is there a mobile app?',
    answer:
      'Yes, we have native iOS and Android apps that sync seamlessly with the web version. Stay productive on the go with full feature access.',
  },
];

export function NguyenFaq() {
  return (
    <section
      id="about"
      className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      aria-labelledby="nguyen-faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1">
            FAQ
          </Badge>
          <h2
            id="nguyen-faq-heading"
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Frequently Asked{' '}
            <span className="text-muted-foreground">Questions</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Get answers to commonly asked questions. Still have questions?{' '}
            <Link
              href="/sign-up"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Get started free.
            </Link>
          </p>
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="space-y-3"
        >
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`item-${index}`}
              className="rounded-lg border border-transparent bg-secondary/30 px-5 py-2 transition-colors data-[state=open]:border-border data-[state=open]:bg-card data-[state=open]:shadow-sm lg:px-7"
            >
              <AccordionTrigger className="text-left text-base hover:no-underline lg:text-lg [&[data-state=open]>svg]:text-foreground">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground lg:text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
