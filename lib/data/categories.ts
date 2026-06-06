export type MenuCategory =
  | "biryani"
  | "fried-rice"
  | "noodles"
  | "starter"
  | "rice"
  | "curry"
  | "bread"
  | "dessert"
  | "beverage";

export type DietType = "veg" | "non-veg" | "egg";

export type MenuCategoryFilter = MenuCategory | "all";

export type DietFilter = DietType | "all";

export const MENU_CATEGORIES: MenuCategory[] = [
  "biryani",
  "fried-rice",
  "noodles",
  "starter",
  "rice",
  "curry",
  "bread",
  "dessert",
  "beverage",
];

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  biryani: "Biryani",
  "fried-rice": "Fried Rice",
  noodles: "Noodles",
  starter: "Starters",
  rice: "Rice Specialties",
  curry: "Curries",
  bread: "Breads",
  dessert: "Desserts",
  beverage: "Beverages",
};

export const DIET_LABELS: Record<DietType, string> = {
  veg: "Veg",
  "non-veg": "Non-Veg",
  egg: "Egg",
};

export const CATEGORY_FILTER_LABELS: Record<MenuCategoryFilter, string> = {
  all: "All",
  ...CATEGORY_LABELS,
};

/** Categories shown in menu filter pills (only those with items in current menu). */
export const MENU_FILTER_CATEGORIES: MenuCategoryFilter[] = [
  "all",
  "biryani",
  "fried-rice",
  "noodles",
  "starter",
  "rice",
];

export type CateringPreviewGroup =
  | "starters"
  | "mains"
  | "rice-bread"
  | "desserts";

export const CATERING_PREVIEW_GROUPS: {
  key: CateringPreviewGroup;
  label: string;
  categories: MenuCategory[];
}[] = [
  { key: "starters", label: "Starters", categories: ["starter"] },
  {
    key: "mains",
    label: "Mains",
    categories: ["curry", "biryani", "fried-rice", "noodles"],
  },
  {
    key: "rice-bread",
    label: "Rice & Bread",
    categories: ["rice", "bread"],
  },
  { key: "desserts", label: "Desserts", categories: ["dessert"] },
];

export function isMenuCategory(value: string): value is MenuCategory {
  return MENU_CATEGORIES.includes(value as MenuCategory);
}

export function isDietType(value: string): value is DietType {
  return value === "veg" || value === "non-veg" || value === "egg";
}
