import type { MenuCategory } from "@/lib/data/categories";

export const BRAND_PREP_NOTES = [
  "No tasting salt or artificial flavor enhancers",
  "No MSG or chemical flavor boosters",
  "Prepared fresh to order",
] as const;

const BIRYANI_NOTES = [
  "Slow-cooked using traditional dum method",
  "Pure ghee + fresh oil, no hydrogenated fats",
  "Authentic Hyderabadi spice blend",
] as const;

const FRIED_RICE_NOODLES_NOTES = [
  "Wok-tossed in fresh oil, never reused",
  "Premium long-grain rice / quality noodles",
] as const;

const STARTER_CHICKEN_VEG_NOTES = ["Fresh oil, never reused"] as const;

const STARTER_SEAFOOD_NOTES = [
  "Fresh seafood, never frozen",
  "Cleaned and prepped same day",
] as const;

const RICE_JEERA_NOTES = [
  "Premium basmati rice",
  "Roasted cumin for authentic aroma",
] as const;

export type StarterVariant = "chicken" | "veg" | "seafood";

export function buildPrepNotes(
  category: MenuCategory,
  starterVariant?: StarterVariant,
): string[] {
  const notes: string[] = [...BRAND_PREP_NOTES];

  switch (category) {
    case "biryani":
      notes.push(...BIRYANI_NOTES);
      break;
    case "fried-rice":
    case "noodles":
      notes.push(...FRIED_RICE_NOODLES_NOTES);
      break;
    case "starter":
      if (starterVariant === "seafood") {
        notes.push(...STARTER_SEAFOOD_NOTES);
      } else {
        notes.push(...STARTER_CHICKEN_VEG_NOTES);
      }
      break;
    case "rice":
      notes.push(...RICE_JEERA_NOTES);
      break;
    default:
      break;
  }

  return notes;
}

export function getStarterVariant(
  slug: string,
  diet: "veg" | "non-veg" | "egg",
): StarterVariant {
  if (
    slug.includes("prawn") ||
    slug.includes("fish") ||
    slug.includes("garlic-fish") ||
    slug.includes("chilli-fish")
  ) {
    return "seafood";
  }
  if (diet === "veg" || diet === "egg") {
    return "veg";
  }
  return "chicken";
}
