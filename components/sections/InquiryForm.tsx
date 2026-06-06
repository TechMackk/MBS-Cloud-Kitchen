"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT, whatsappUrl } from "@/lib/constants";

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[+]?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  email: z.union([
    z.literal(""),
    z.string().email("Please enter a valid email address"),
  ]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export function InquiryForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(_data: InquiryFormValues) {
    toast.info(
      "Form submission will be enabled in a future update. For immediate response, WhatsApp us.",
      {
        duration: 8000,
        action: {
          label: "WhatsApp",
          onClick: () => {
            window.open(
              whatsappUrl(
                CONTACT.whatsappOrdersRaw,
                "Hi, I'd like to get in touch!",
              ),
              "_blank",
              "noopener,noreferrer",
            );
          },
        },
        icon: <MessageCircle className="h-4 w-4 text-green-soft" />,
      },
    );
    reset();
  }

  return (
    <section className="py-16 sm:py-24" aria-labelledby="inquiry-form-heading">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2
            id="inquiry-form-heading"
            className="font-heading text-3xl font-bold text-green-deep sm:text-4xl"
          >
            Send Us a Message
          </h2>
          <p className="mt-4 text-text/70">
            Have a question? Fill out the form and we&apos;ll get back to you.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-2xl border border-green-soft/20 bg-bg p-6 shadow-sm sm:p-8"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-orange">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              error={Boolean(errors.name)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-orange" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone <span className="text-orange">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              error={Boolean(errors.phone)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              {...register("phone")}
            />
            {errors.phone && (
              <p id="phone-error" className="text-sm text-orange" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              error={Boolean(errors.email)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-orange" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              Message <span className="text-orange">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us how we can help..."
              error={Boolean(errors.message)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
              {...register("message")}
            />
            {errors.message && (
              <p
                id="message-error"
                className="text-sm text-orange"
                role="alert"
              >
                {errors.message.message}
              </p>
            )}
          </div>

          <Button type="submit" variant="default" size="lg" className="w-full" disabled={isSubmitting}>
            Send Message
          </Button>

          <p className="text-center text-sm text-text/60">
            Need a faster response?{" "}
            <a
              href={whatsappUrl(
                CONTACT.whatsappOrdersRaw,
                "Hi, I'd like to get in touch!",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-green-deep transition-colors hover:text-orange"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp us
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
