export const MENU_TAG_SUGGESTIONS = [
  "Chef Recommended",
  "Healthy Choice",
  "Satvik",
  "Spicy",
  "Bestseller",
] as const;

export type MenuTagSuggestion = (typeof MENU_TAG_SUGGESTIONS)[number];

const TAG_RIBBON_CLASSES: Record<string, string> = {
  "Chef Recommended": "bg-orange text-white",
  "Healthy Choice": "bg-green-soft text-green-deep",
  Satvik: "bg-cream text-green-deep border border-orange/30",
  Spicy: "bg-red-600 text-white",
  Bestseller: "bg-blue-600 text-white",
};

const TAG_BADGE_CLASSES: Record<string, string> = {
  "Chef Recommended": "bg-orange/15 text-orange border-orange/30",
  "Healthy Choice": "bg-green-soft/20 text-green-deep border-green-soft/40",
  Satvik: "bg-cream text-green-deep border-orange/30",
  Spicy: "bg-red-50 text-red-700 border-red-200",
  Bestseller: "bg-blue-50 text-blue-700 border-blue-200",
};

export function getTagRibbonClasses(tag: string): string {
  return TAG_RIBBON_CLASSES[tag] ?? "bg-green-soft text-green-deep";
}

export function getTagBadgeClasses(tag: string): string {
  return TAG_BADGE_CLASSES[tag] ?? "bg-green-soft/20 text-green-deep border-green-soft/40";
}

export function getSuggestionChipClasses(tag: MenuTagSuggestion): string {
  switch (tag) {
    case "Chef Recommended":
      return "border-orange/40 text-orange hover:bg-orange/10";
    case "Healthy Choice":
      return "border-green-soft text-green-deep hover:bg-green-soft/10";
    case "Satvik":
      return "border-orange/30 text-green-deep hover:bg-cream";
    case "Spicy":
      return "border-red-300 text-red-700 hover:bg-red-50";
    case "Bestseller":
      return "border-blue-300 text-blue-700 hover:bg-blue-50";
    default:
      return "border-green-soft/40 text-green-deep hover:bg-green-soft/10";
  }
}
