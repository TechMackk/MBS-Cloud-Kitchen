import type { DietType, MenuCategory } from "@/lib/data/categories";

export type { DietType, MenuCategory };

export interface CateringItem {
  id: string;
  slug: string;
  name: string;
  diet: DietType;
  category: MenuCategory;
  pricePerPlate: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
}

export type OccasionType =
  | "wedding"
  | "birthday"
  | "corporate"
  | "house-warming"
  | "festival"
  | "other";

export type SessionType = "lunch" | "dinner" | "both";

export type CateringDietPreference = "veg" | "non-veg" | "both";

export const OCCASION_LABELS: Record<OccasionType, string> = {
  wedding: "Wedding",
  birthday: "Birthday",
  corporate: "Corporate",
  "house-warming": "House Warming",
  festival: "Festival",
  other: "Other",
};

export const SESSION_LABELS: Record<SessionType, string> = {
  lunch: "Lunch",
  dinner: "Dinner",
  both: "Both",
};

export const CATERING_DIET_LABELS: Record<CateringDietPreference, string> = {
  veg: "Veg Only",
  "non-veg": "Non-Veg Only",
  both: "Both",
};

type CateringItemSeed = Omit<CateringItem, "slug">;

const CATERING_ITEM_SEEDS: CateringItemSeed[] = [
  {
    id: "cat-veg-starter-platter",
    name: "Veg Starter Platter",
    diet: "veg",
    category: "starter",
    pricePerPlate: 120,
    description: "Mirchi bajji, pesarattu bites, and sakinalu assortment.",
    imageUrl:
      "https://images.unsplash.com/photo-1601050690597-df0568fa7098?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-nonveg-starter-platter",
    name: "Non-Veg Starter Platter",
    diet: "non-veg",
    category: "starter",
    pricePerPlate: 180,
    description: "Chicken 65, kebab bites, and crispy appetizers.",
    imageUrl:
      "https://images.unsplash.com/photo-1626082927389-6dd097cdc6ec?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-veg-biryani",
    name: "Veg Dum Biryani",
    diet: "veg",
    category: "biryani",
    pricePerPlate: 220,
    description: "Seasonal vegetable biryani with raita.",
    imageUrl:
      "https://images.unsplash.com/photo-1633945274418-7c9a395b6083?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-mutton-biryani",
    name: "Hyderabadi Mutton Biryani",
    diet: "non-veg",
    category: "biryani",
    pricePerPlate: 320,
    description: "Signature dum biryani with raita and salan.",
    imageUrl:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-chicken-biryani",
    name: "Chicken Dum Biryani",
    diet: "non-veg",
    category: "biryani",
    pricePerPlate: 280,
    description: "Aromatic chicken biryani with raita.",
    imageUrl:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-gongura-pappu",
    name: "Gongura Pappu",
    diet: "veg",
    category: "curry",
    pricePerPlate: 140,
    description: "Tangy sorrel leaf dal.",
    imageUrl:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-gongura-mutton",
    name: "Gongura Mutton",
    diet: "non-veg",
    category: "curry",
    pricePerPlate: 280,
    description: "Telangana classic mutton curry.",
    imageUrl:
      "https://images.unsplash.com/photo-1603133872871-684103279646?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-bagara-baingan",
    name: "Bagara Baingan",
    diet: "veg",
    category: "curry",
    pricePerPlate: 160,
    description: "Baby eggplants in peanut-sesame gravy.",
    imageUrl:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-natu-kodi",
    name: "Natu Kodi Pulusu",
    diet: "non-veg",
    category: "curry",
    pricePerPlate: 260,
    description: "Country chicken in tangy tamarind gravy.",
    imageUrl:
      "https://images.unsplash.com/photo-1604908176997-431246657551?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-jeera-rice",
    name: "Jeera Rice",
    diet: "veg",
    category: "rice",
    pricePerPlate: 90,
    description: "Fragrant cumin tempered basmati rice.",
    imageUrl:
      "https://images.unsplash.com/photo-1516684669130-eeeec9b2d0b7?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-bread-basket",
    name: "Assorted Bread Basket",
    diet: "veg",
    category: "bread",
    pricePerPlate: 70,
    description: "Naan and roti assortment.",
    imageUrl:
      "https://images.unsplash.com/photo-1617093727343-374698b1d08c?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-double-ka-meetha",
    name: "Double Ka Meetha",
    diet: "veg",
    category: "dessert",
    pricePerPlate: 110,
    description: "Hyderabadi bread pudding with dry fruits.",
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-qubani-ka-meetha",
    name: "Qubani Ka Meetha",
    diet: "veg",
    category: "dessert",
    pricePerPlate: 130,
    description: "Apricot dessert with fresh cream.",
    imageUrl:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop",
    isAvailable: true,
  },
  {
    id: "cat-haleem",
    name: "Hyderabadi Haleem",
    diet: "non-veg",
    category: "curry",
    pricePerPlate: 240,
    description: "Slow-cooked wheat and meat stew.",
    imageUrl:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
    isAvailable: false,
  },
];

export const CATERING_ITEMS: CateringItem[] = CATERING_ITEM_SEEDS.map(
  (item) => ({
    ...item,
    slug: item.id,
  }),
);

export function filterCateringItemsByDiet(
  items: CateringItem[],
  diet: CateringDietPreference,
): CateringItem[] {
  if (diet === "both") {
    return items.filter((item) => item.isAvailable);
  }
  return items.filter(
    (item) => item.isAvailable && item.diet === diet,
  );
}

export function getCateringItemsByDiet(
  diet: CateringDietPreference,
): CateringItem[] {
  return filterCateringItemsByDiet(CATERING_ITEMS, diet);
}

export function getCateringItemById(id: string): CateringItem | undefined {
  return CATERING_ITEMS.find((item) => item.id === id);
}

export function estimateCateringCostFromItems(
  catalog: CateringItem[],
  selectedItemIds: string[],
  guestCount: number,
): number {
  const items = selectedItemIds
    .map((id) => catalog.find((item) => item.id === id))
    .filter((item): item is CateringItem => item !== undefined);

  const perPlateTotal = items.reduce(
    (sum, item) => sum + item.pricePerPlate,
    0,
  );

  return perPlateTotal * guestCount;
}

export function estimateCateringCost(
  selectedItemIds: string[],
  guestCount: number,
): number {
  return estimateCateringCostFromItems(
    CATERING_ITEMS,
    selectedItemIds,
    guestCount,
  );
}
