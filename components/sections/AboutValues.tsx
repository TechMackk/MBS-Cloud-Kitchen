import { Eye, Heart, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ValueItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const VALUES: ValueItem[] = [
  {
    id: "authenticity",
    title: "Authenticity",
    description:
      "Real Telangana flavors, not fusion shortcuts. Every recipe stays true to its roots.",
    icon: Sparkles,
  },
  {
    id: "hygiene",
    title: "Hygiene",
    description:
      "Our kitchen is audited daily — cleanliness is non-negotiable in everything we do.",
    icon: ShieldCheck,
  },
  {
    id: "transparency",
    title: "Transparency",
    description:
      "Every dish's prep notes are visible. You know exactly what goes into your meal.",
    icon: Eye,
  },
  {
    id: "community",
    title: "Community",
    description:
      "Built by locals, for locals. We celebrate Hyderabad's food culture every day.",
    icon: Heart,
  },
];

export function AboutValues() {
  return (
    <section className="py-16 sm:py-24" aria-labelledby="about-values-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="about-values-heading"
            className="font-heading text-3xl font-bold text-green-deep sm:text-4xl"
          >
            What We Stand For
          </h2>
          <p className="mt-4 text-text/70">
            The principles that guide every dish we prepare.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => {
            const Icon = value.icon;

            return (
              <Card
                key={value.id}
                className="group hover:border-green-neon/40 hover:shadow-glow-card"
              >
                <CardHeader>
                  <div
                    className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-green-deep transition-colors group-hover:bg-green-neon/20"
                    aria-hidden="true"
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
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
