import {
  ChefHat,
  Flame,
  Leaf,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ProcessStep = {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "source",
    number: 1,
    title: "Source",
    description:
      "Fresh local ingredients sourced daily from trusted Hyderabad markets.",
    icon: Leaf,
  },
  {
    id: "prep",
    number: 2,
    title: "Prep",
    description:
      "Hand-prepared with care — no shortcuts, no pre-made mixes.",
    icon: ChefHat,
  },
  {
    id: "cook",
    number: 3,
    title: "Cook",
    description:
      "Traditional Telangana recipes cooked the way generations intended.",
    icon: Flame,
  },
  {
    id: "deliver",
    number: 4,
    title: "Deliver",
    description:
      "Packed hot and hygienically, dispatched fast to your doorstep.",
    icon: Truck,
  },
];

function ProcessStepCard({
  step,
  isLast,
}: {
  step: ProcessStep;
  isLast: boolean;
}) {
  const Icon = step.icon;

  return (
    <li className="relative flex flex-1 flex-col items-center">
      {!isLast && (
        <>
          <span
            className="absolute left-[calc(50%+2rem)] top-6 hidden h-0.5 w-[calc(100%-4rem)] bg-green-soft/40 lg:block"
            aria-hidden="true"
          />
          <span
            className="absolute left-1/2 top-[calc(100%+0.5rem)] h-8 w-0.5 -translate-x-1/2 bg-green-soft/40 lg:hidden"
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-orange text-xs font-bold text-white">
            {step.number}
          </span>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-green-deep">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        </div>

        <h3 className="font-heading text-lg font-semibold text-green-deep">
          {step.title}
        </h3>
        <p className="mt-2 max-w-[200px] text-sm leading-relaxed text-text/70">
          {step.description}
        </p>
      </div>
    </li>
  );
}

export function AboutProcess() {
  return (
    <section
      className="bg-cream/30 py-16 sm:py-24"
      aria-labelledby="about-process-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="about-process-heading"
            className="font-heading text-3xl font-bold text-green-deep sm:text-4xl"
          >
            How We Prepare Your Food
          </h2>
          <p className="mt-4 text-text/70">
            From market to your table — every step is designed for freshness.
          </p>
        </div>

        <ol
          className={cn(
            "flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-4",
          )}
        >
          {PROCESS_STEPS.map((step, index) => (
            <ProcessStepCard
              key={step.id}
              step={step}
              isLast={index === PROCESS_STEPS.length - 1}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
