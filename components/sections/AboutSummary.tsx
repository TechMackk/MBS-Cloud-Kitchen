import { BookOpen, ChefHat, HeartHandshake } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ABOUT_CARDS, type AboutCard } from "@/lib/constants";

const iconMap = {
  "book-open": BookOpen,
  "heart-handshake": HeartHandshake,
  "chef-hat": ChefHat,
} as const;

function AboutCardItem({ card }: { card: AboutCard }) {
  const Icon = iconMap[card.iconName];

  return (
    <Card className="group hover:shadow-glow-card hover:border-green-neon/40">
      <CardHeader>
        <div
          className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-green-deep transition-colors group-hover:bg-green-neon/20"
          aria-hidden="true"
        >
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle>{card.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{card.description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export function AboutSummary() {
  return (
    <section
      className="py-16 sm:py-24"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2
            id="about-heading"
            className="font-heading text-3xl font-bold text-green-deep sm:text-4xl"
          >
            Who We Are
          </h2>
          <p className="mt-4 text-text/70">
            Rooted in Telangana tradition, crafted with care for your table.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT_CARDS.map((card) => (
            <AboutCardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
