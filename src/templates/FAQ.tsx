import { useTranslations } from 'next-intl';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Section } from '@/features/landing/Section';

type FAQItem = {
  question: string;
  answer: string;
};

export const FAQ = () => {
  const t = useTranslations('FAQ');

  const faqItems = t.raw('items') as unknown as FAQItem[];

  if (!Array.isArray(faqItems)) {
    console.error('Expected faqItems to be an array but got:', faqItems);
    return null; // avoid breaking if data is malformed
  }

  return (
    <Section>
      <Accordion type="multiple" className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
};
