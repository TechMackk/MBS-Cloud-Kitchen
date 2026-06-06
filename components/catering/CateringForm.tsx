"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createCateringRequestAction } from "@/app/(public)/catering/actions";

import { VegBadge } from "@/components/menu/VegBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_LABELS } from "@/lib/data/categories";
import {
  CATERING_DIET_LABELS,
  estimateCateringCostFromItems,
  filterCateringItemsByDiet,
  OCCASION_LABELS,
  SESSION_LABELS,
  type CateringItem,
  type OccasionType,
  type SessionType,
  type CateringDietPreference,
} from "@/lib/data/catering-menu";
import { CATERING_PREVIEW_GROUPS } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

const occasionValues = [
  "wedding",
  "birthday",
  "corporate",
  "house-warming",
  "festival",
  "other",
] as const satisfies readonly OccasionType[];

const sessionValues = ["lunch", "dinner", "both"] as const satisfies readonly SessionType[];

const dietValues = ["veg", "non-veg", "both"] as const satisfies readonly CateringDietPreference[];

const cateringFormSchema = z.object({
  occasion: z.enum(occasionValues, {
    required_error: "Please select an occasion",
  }),
  session: z.enum(sessionValues, {
    required_error: "Please select a session",
  }),
  eventDate: z.string().min(1, "Please select an event date"),
  guestCount: z.coerce
    .number({ invalid_type_error: "Please enter a valid number" })
    .min(10, "Minimum 10 guests required"),
  dietPreference: z.enum(dietValues, {
    required_error: "Please select a diet preference",
  }),
  selectedMenuItems: z
    .array(z.string())
    .min(1, "Please select at least one menu item"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[+]?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  email: z.union([
    z.literal(""),
    z.string().email("Please enter a valid email address"),
  ]),
  eventLocation: z.string().min(5, "Please enter the event location"),
  specialInstructions: z.string().optional(),
});

type CateringFormValues = z.infer<typeof cateringFormSchema>;

const STEP_FIELDS: Record<number, (keyof CateringFormValues)[]> = {
  1: ["occasion", "session", "eventDate", "guestCount", "dietPreference"],
  2: ["selectedMenuItems"],
  3: ["name", "phone", "email", "eventLocation", "specialInstructions"],
};

const STEPS = [
  { number: 1, label: "Event Details" },
  { number: 2, label: "Menu Selection" },
  { number: 3, label: "Contact & Confirm" },
];

export interface CateringFormProps {
  items: CateringItem[];
}

export function CateringForm({ items: catalogItems }: CateringFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CateringFormValues>({
    resolver: zodResolver(cateringFormSchema),
    defaultValues: {
      occasion: undefined,
      session: undefined,
      eventDate: "",
      guestCount: 10,
      dietPreference: undefined,
      selectedMenuItems: [],
      name: "",
      phone: "",
      email: "",
      eventLocation: "",
      specialInstructions: "",
    },
    mode: "onTouched",
  });

  const dietPreference = watch("dietPreference");
  const selectedMenuItems = watch("selectedMenuItems");
  const guestCount = watch("guestCount");
  const occasion = watch("occasion");
  const session = watch("session");
  const eventDate = watch("eventDate");

  const availableItems = useMemo(() => {
    if (!dietPreference) {
      return [];
    }
    return filterCateringItemsByDiet(catalogItems, dietPreference);
  }, [catalogItems, dietPreference]);

  const groupedItems = useMemo(() => {
    return CATERING_PREVIEW_GROUPS.map((group) => ({
      ...group,
      items: availableItems.filter((item) =>
        group.categories.includes(item.category),
      ),
    })).filter((group) => group.items.length > 0);
  }, [availableItems]);

  const estimatedCost = useMemo(
    () =>
      estimateCateringCostFromItems(
        catalogItems,
        selectedMenuItems,
        guestCount || 0,
      ),
    [catalogItems, selectedMenuItems, guestCount],
  );

  const today = format(new Date(), "yyyy-MM-dd");

  async function handleNext() {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields);
    if (valid) {
      setStep((current) => Math.min(current + 1, 3));
    }
  }

  function handleBack() {
    setStep((current) => Math.max(current - 1, 1));
  }

  function toggleMenuItem(itemId: string, checked: boolean) {
    const current = selectedMenuItems ?? [];
    if (checked) {
      setValue("selectedMenuItems", [...current, itemId], {
        shouldValidate: true,
      });
    } else {
      setValue(
        "selectedMenuItems",
        current.filter((id) => id !== itemId),
        { shouldValidate: true },
      );
    }
  }

  async function onSubmit(data: CateringFormValues) {
    setIsSubmitting(true);

    const selectedItems = data.selectedMenuItems
      .map((id) => catalogItems.find((item) => item.id === id))
      .filter((item): item is CateringItem => item !== undefined)
      .map((item) => ({
        cateringItemId: item.id,
        name: item.name,
        pricePerPlate: item.pricePerPlate,
      }));

    const formData = new FormData();
    formData.set("occasion", data.occasion);
    formData.set("session", data.session);
    formData.set("eventDate", data.eventDate);
    formData.set("guestCount", String(data.guestCount));
    formData.set("dietPreference", data.dietPreference);
    formData.set("name", data.name);
    formData.set("phone", data.phone);
    if (data.email) formData.set("email", data.email);
    formData.set("eventLocation", data.eventLocation);
    if (data.specialInstructions) {
      formData.set("specialInstructions", data.specialInstructions);
    }
    formData.set("estimatedTotal", String(estimatedCost));
    formData.set("selectedMenuItems", JSON.stringify(data.selectedMenuItems));
    formData.set("items", JSON.stringify(selectedItems));

    const result = await createCateringRequestAction(formData);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(
      `Request submitted! Number: ${result.data?.requestNumber}`,
      {
        duration: 8000,
        icon: <MessageCircle className="h-4 w-4 text-green-soft" />,
      },
    );

    if (result.data?.whatsappUrl) {
      window.open(result.data.whatsappUrl, "_blank", "noopener,noreferrer");
    }

    router.push(`/catering/request/${result.data?.requestNumber}`);
  }

  return (
    <section
      className="bg-cream/30 py-16 sm:py-24"
      aria-labelledby="catering-form-heading"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2
            id="catering-form-heading"
            className="font-heading text-3xl font-bold text-green-deep sm:text-4xl"
          >
            Request Catering
          </h2>
          <p className="mt-4 text-text/70">
            Tell us about your event and we&apos;ll prepare a custom quote.
          </p>
        </div>

        <nav aria-label="Form progress" className="mb-8">
          <ol className="flex items-center justify-between">
            {STEPS.map((stepItem, index) => (
              <li
                key={stepItem.number}
                className={cn(
                  "flex flex-1 flex-col items-center",
                  index < STEPS.length - 1 && "relative",
                )}
              >
                {index < STEPS.length - 1 && (
                  <span
                    className={cn(
                      "absolute left-[calc(50%+1rem)] top-4 hidden h-0.5 w-[calc(100%-2rem)] sm:block",
                      step > stepItem.number ? "bg-green-soft" : "bg-green-soft/30",
                    )}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                    step >= stepItem.number
                      ? "bg-green-deep text-cream"
                      : "border border-green-soft/40 bg-bg text-text/50",
                  )}
                  aria-current={step === stepItem.number ? "step" : undefined}
                >
                  {stepItem.number}
                </span>
                <span className="mt-2 hidden text-xs font-medium text-text/70 sm:block">
                  {stepItem.label}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-2xl border border-green-soft/20 bg-bg p-6 shadow-sm sm:p-8"
          noValidate
        >
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="occasion">
                  Occasion <span className="text-orange">*</span>
                </Label>
                <Select
                  value={occasion}
                  onValueChange={(value) =>
                    setValue("occasion", value as OccasionType, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="occasion" aria-invalid={Boolean(errors.occasion)}>
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    {occasionValues.map((value) => (
                      <SelectItem key={value} value={value}>
                        {OCCASION_LABELS[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.occasion && (
                  <p className="text-sm text-orange" role="alert">
                    {errors.occasion.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>
                  Session <span className="text-orange">*</span>
                </Label>
                <RadioGroup
                  value={session}
                  onValueChange={(value) =>
                    setValue("session", value as SessionType, {
                      shouldValidate: true,
                    })
                  }
                  className="flex flex-wrap gap-4"
                >
                  {sessionValues.map((value) => (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem value={value} id={`session-${value}`} />
                      <Label htmlFor={`session-${value}`} className="font-normal">
                        {SESSION_LABELS[value]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.session && (
                  <p className="text-sm text-orange" role="alert">
                    {errors.session.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDate">
                  Event Date <span className="text-orange">*</span>
                </Label>
                <Input
                  id="eventDate"
                  type="date"
                  min={today}
                  error={Boolean(errors.eventDate)}
                  aria-invalid={Boolean(errors.eventDate)}
                  {...register("eventDate")}
                />
                {errors.eventDate && (
                  <p className="text-sm text-orange" role="alert">
                    {errors.eventDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestCount">
                  Number of Guests <span className="text-orange">*</span>
                </Label>
                <Input
                  id="guestCount"
                  type="number"
                  min={10}
                  error={Boolean(errors.guestCount)}
                  aria-invalid={Boolean(errors.guestCount)}
                  {...register("guestCount")}
                />
                {errors.guestCount && (
                  <p className="text-sm text-orange" role="alert">
                    {errors.guestCount.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>
                  Diet Preference <span className="text-orange">*</span>
                </Label>
                <RadioGroup
                  value={dietPreference}
                  onValueChange={(value) => {
                    setValue("dietPreference", value as CateringDietPreference, {
                      shouldValidate: true,
                    });
                    setValue("selectedMenuItems", [], { shouldValidate: false });
                  }}
                  className="flex flex-wrap gap-4"
                >
                  {dietValues.map((value) => (
                    <div key={value} className="flex items-center gap-2">
                      <RadioGroupItem value={value} id={`diet-${value}`} />
                      <Label htmlFor={`diet-${value}`} className="font-normal">
                        {CATERING_DIET_LABELS[value]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.dietPreference && (
                  <p className="text-sm text-orange" role="alert">
                    {errors.dietPreference.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {!dietPreference ? (
                <p className="text-sm text-text/60">
                  Please complete Step 1 and select a diet preference first.
                </p>
              ) : (
                groupedItems.map((group) => (
                  <div key={group.key}>
                    <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-green-deep">
                      {group.label}
                    </h3>
                    <ul className="space-y-3">
                      {group.items.map((item) => {
                        const checked = selectedMenuItems.includes(item.id);

                        return (
                          <li
                            key={item.id}
                            className="flex items-start gap-3 rounded-xl border border-green-soft/20 p-3"
                          >
                            <Checkbox
                              id={`menu-${item.id}`}
                              checked={checked}
                              onCheckedChange={(value) =>
                                toggleMenuItem(item.id, value === true)
                              }
                              aria-describedby={`menu-desc-${item.id}`}
                            />
                            <div className="min-w-0 flex-1">
                              <label
                                htmlFor={`menu-${item.id}`}
                                className="flex cursor-pointer items-center gap-2 font-medium text-green-deep"
                              >
                                {item.name}
                                <VegBadge diet={item.diet} />
                              </label>
                              <p
                                id={`menu-desc-${item.id}`}
                                className="mt-1 text-sm text-text/60"
                              >
                                {item.description} ·{" "}
                                {CATEGORY_LABELS[item.category]}
                              </p>
                            </div>
                            <span className="shrink-0 text-sm font-semibold text-orange">
                              ₹{item.pricePerPlate}/plate
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}

              {errors.selectedMenuItems && (
                <p className="text-sm text-orange" role="alert">
                  {errors.selectedMenuItems.message}
                </p>
              )}

              <div className="rounded-xl bg-cream/50 px-4 py-3 text-sm">
                <p className="font-semibold text-green-deep">
                  Estimated: ₹{estimatedCost.toLocaleString("en-IN")}
                </p>
                <p className="text-text/60">
                  ({selectedMenuItems.length} dishes × {guestCount || 0} guests)
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-green-soft/20 bg-cream/30 p-4 text-sm">
                <h3 className="mb-3 font-heading font-semibold text-green-deep">
                  Order Summary
                </h3>
                <dl className="space-y-1 text-text/70">
                  <div className="flex justify-between gap-4">
                    <dt>Occasion</dt>
                    <dd className="font-medium text-green-deep">
                      {occasion ? OCCASION_LABELS[occasion] : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Session</dt>
                    <dd className="font-medium text-green-deep">
                      {session ? SESSION_LABELS[session] : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Date</dt>
                    <dd className="font-medium text-green-deep">
                      {eventDate
                        ? format(new Date(eventDate), "dd MMM yyyy")
                        : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Guests</dt>
                    <dd className="font-medium text-green-deep">{guestCount}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Menu items</dt>
                    <dd className="font-medium text-green-deep">
                      {selectedMenuItems.length} selected
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-green-soft/20 pt-2">
                    <dt>Estimated total</dt>
                    <dd className="font-semibold text-orange">
                      ₹{estimatedCost.toLocaleString("en-IN")}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-orange">*</span>
                </Label>
                <Input
                  id="name"
                  error={Boolean(errors.name)}
                  aria-invalid={Boolean(errors.name)}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-orange" role="alert">
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
                  error={Boolean(errors.phone)}
                  aria-invalid={Boolean(errors.phone)}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-orange" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  error={Boolean(errors.email)}
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-orange" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventLocation">
                  Event Location / Address <span className="text-orange">*</span>
                </Label>
                <Textarea
                  id="eventLocation"
                  error={Boolean(errors.eventLocation)}
                  aria-invalid={Boolean(errors.eventLocation)}
                  {...register("eventLocation")}
                />
                {errors.eventLocation && (
                  <p className="text-sm text-orange" role="alert">
                    {errors.eventLocation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any dietary restrictions, setup requirements, or notes..."
                  {...register("specialInstructions")}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <Button type="button" variant="default" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" variant="default" disabled={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Send Catering Request"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
