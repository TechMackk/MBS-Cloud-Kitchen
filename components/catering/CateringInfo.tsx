import {
  CalendarHeart,
  ChefHat,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Highlight = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const HIGHLIGHTS: Highlight[] = [
  {
    id: "menus",
    title: "Veg & Non-Veg Menus",
    description: "Wide variety of authentic Telangana dishes for every palate.",
    icon: UtensilsCrossed,
  },
  {
    id: "occasions",
    title: "Any Occasion",
    description:
      "Weddings, birthdays, corporate events, house warmings, and more.",
    icon: CalendarHeart,
  },
  {
    id: "custom",
    title: "Custom Menu Planning",
    description:
      "Tailored menus designed around your event size, budget, and preferences.",
    icon: ChefHat,
  },
  {
    id: "hygiene",
    title: "Hygiene Certified",
    description:
      "Same kitchen standards as our daily service — audited and certified.",
    icon: ShieldCheck,
  },
];

export function CateringInfo() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="catering-info-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="catering-info-heading"
            className="font-heading text-3xl font-bold text-green-deep sm:text-4xl"
          >
            Why Choose MBS Catering
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.id}
                className="group hover:border-green-neon/40 hover:shadow-glow-card"
              >
                <CardHeader>
                  <div
                    className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-green-deep transition-colors group-hover:bg-green-neon/20"
                    aria-hidden="true"
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
