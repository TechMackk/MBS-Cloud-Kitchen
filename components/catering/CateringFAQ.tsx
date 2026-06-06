"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "booking",
    question: "How far in advance should I book?",
    answer:
      "We recommend booking at least 7–10 days in advance for events up to 100 guests. For larger weddings or corporate events, please reach out 2–3 weeks ahead to ensure menu planning and ingredient sourcing.",
  },
  {
    id: "minimum",
    question: "What's the minimum guest count?",
    answer:
      "Our catering service starts at a minimum of 10 guests. For smaller gatherings, you can order directly from our regular menu via WhatsApp.",
  },
  {
    id: "staff",
    question: "Do you provide serving staff?",
    answer:
      "Serving staff can be arranged for an additional fee depending on event size and location. Mention this in your enquiry and we'll include it in your quote.",
  },
  {
    id: "customize",
    question: "Can the menu be customized?",
    answer:
      "Absolutely. Every catering event gets a customized menu based on your diet preferences, guest count, occasion, and budget. Use the form below to share your requirements.",
  },
  {
    id: "cancellation",
    question: "What's your cancellation policy?",
    answer:
      "Cancellations made 72+ hours before the event receive a full refund of any advance paid. Cancellations within 48–72 hours incur a 50% charge. Within 48 hours, the full amount is non-refundable.",
  },
];

export function CateringFAQ() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="catering-faq-heading">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2
          id="catering-faq-heading"
          className="mb-8 text-center font-heading text-3xl font-bold text-green-deep sm:text-4xl"
        >
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
