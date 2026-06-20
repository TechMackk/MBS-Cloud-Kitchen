// SEED DATA ONLY. Public pages now read from DB. Edit menu items via /admin/menu.

import type { DietType, MenuCategory } from "@/lib/data/categories";
import { buildPrepNotes, getStarterVariant } from "@/lib/data/menu-prep";

export type { DietType, MenuCategory };

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  prepNotes: string[];
  category: MenuCategory;
  diet: DietType;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  spiceLevel?: 1 | 2 | 3;
  servingSize?: string;
  calories?: number;
  protein?: number;
  tags?: string[];
}

type ItemInput = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: MenuCategory;
  diet: DietType;
  price: number;
  imageUrl?: string;
  isFeatured?: boolean;
  spiceLevel?: 1 | 2 | 3;
  servingSize?: string;
};

function item(input: ItemInput): MenuItem {
  const starterVariant =
    input.category === "starter"
      ? getStarterVariant(input.slug, input.diet)
      : undefined;

  return {
    id: input.slug,
    slug: input.slug,
    name: input.name,
    description: input.description,
    longDescription: input.longDescription,
    prepNotes: buildPrepNotes(input.category, starterVariant),
    category: input.category,
    diet: input.diet,
    price: input.price,
    imageUrl: input.imageUrl ?? "",
    isAvailable: true,
    isFeatured: input.isFeatured ?? false,
    spiceLevel: input.spiceLevel,
    servingSize: input.servingSize,
  };
}

const STARTERS_FRY = [
  item({
    slug: "chicken-pakoda-bone",
    name: "Chicken Pakoda (Bone)",
    description: "Crispy bone-in chicken pakoda, Telangana-style.",
    longDescription:
      "Marinated bone-in chicken coated in spiced gram flour and deep-fried until golden and crunchy. A classic starter best enjoyed hot.",
    category: "starter",
    diet: "non-veg",
    price: 130,
    servingSize: "200g",
  }),
  item({
    slug: "chicken-pakoda-boneless",
    name: "Chicken Pakoda (Boneless)",
    description: "Boneless chicken pakoda with a crisp, spiced coating.",
    longDescription:
      "Tender boneless chicken pieces marinated in house spices, battered, and fried to a crunchy finish. Perfect as a snack or side.",
    category: "starter",
    diet: "non-veg",
    price: 200,
    servingSize: "200g",
  }),
  item({
    slug: "fried-chicken-leg-piece",
    name: "Fried Chicken Leg Piece",
    description: "Crispy fried chicken leg piece.",
    longDescription:
      "Juicy chicken leg pieces marinated and fried until golden and crisp. Order by piece — ideal as a quick snack or alongside rice.",
    category: "starter",
    diet: "non-veg",
    price: 70,
    servingSize: "₹70 (1 pc) / ₹130 (2 pcs)",
  }),
  item({
    slug: "chicken-drumsticks",
    name: "Chicken Drumsticks",
    description: "Spiced and fried chicken drumsticks.",
    longDescription:
      "Flavorful chicken drumsticks marinated in South Indian spices and fried until crisp outside and juicy inside.",
    category: "starter",
    diet: "non-veg",
    price: 70,
    servingSize: "₹70 (1 pc) / ₹130 (2 pcs)",
  }),
  item({
    slug: "chicken-wings",
    name: "Chicken Wings",
    description: "Crispy fried chicken wings.",
    longDescription:
      "Well-seasoned chicken wings fried to a golden crunch. A crowd-pleasing starter for sharing or solo indulgence.",
    category: "starter",
    diet: "non-veg",
    price: 80,
    servingSize: "₹80 (2 pcs) / ₹150 (4 pcs)",
  }),
  item({
    slug: "fried-fish-boneless",
    name: "Fried Fish (Boneless)",
    description: "Boneless fish fillet, lightly spiced and fried crisp.",
    longDescription:
      "Fresh boneless fish marinated with mild spices and fried until golden. Clean, flaky, and satisfying.",
    category: "starter",
    diet: "non-veg",
    price: 120,
  }),
];

const PULAO_RICE = [
  item({
    slug: "chicken-pulao",
    name: "Chicken Pulao",
    description: "Fragrant chicken pulao with aromatic basmati rice.",
    longDescription:
      "Basmati rice cooked with tender chicken pieces and whole spices for a comforting, homestyle pulao.",
    category: "rice",
    diet: "non-veg",
    price: 99,
    isFeatured: true,
  }),
  item({
    slug: "special-chicken-pulao",
    name: "Special Chicken Pulao",
    description: "Premium chicken pulao with extra masala and garnish.",
    longDescription:
      "Our signature chicken pulao loaded with marinated chicken, fried onions, and aromatic spices — a house favourite.",
    category: "rice",
    diet: "non-veg",
    price: 150,
    isFeatured: true,
  }),
  item({
    slug: "chicken-fry-piece-pulao",
    name: "Chicken Fry Piece Pulao",
    description: "Pulao topped with crispy chicken fry pieces.",
    longDescription:
      "Fragrant pulao rice crowned with crunchy spiced chicken fry pieces for texture and bold flavour in every bite.",
    category: "rice",
    diet: "non-veg",
    price: 140,
  }),
  item({
    slug: "mutton-pulao",
    name: "Mutton Pulao",
    description: "Slow-cooked mutton pulao with rich, deep flavour.",
    longDescription:
      "Tender mutton pieces simmered with basmati rice and whole spices for a hearty, aromatic pulao.",
    category: "rice",
    diet: "non-veg",
    price: 199,
  }),
  item({
    slug: "special-mutton-pulao",
    name: "Special Mutton Pulao",
    description: "Premium mutton pulao with extra masala and garnish.",
    longDescription:
      "A richer take on mutton pulao with generous mutton pieces, fried onions, and our special spice blend.",
    category: "rice",
    diet: "non-veg",
    price: 250,
    isFeatured: true,
  }),
  item({
    slug: "special-gongura-kodi-pulao",
    name: "Special Gongura Kodi Pulao",
    description: "Tangy gongura chicken pulao — a Telangana specialty.",
    longDescription:
      "Chicken and rice cooked with tangy gongura (sorrel leaves) for a distinctive Andhra-Telangana flavour profile.",
    category: "rice",
    diet: "non-veg",
    price: 169,
  }),
  item({
    slug: "fried-fish-pulao",
    name: "Fried Fish Pulao",
    description: "Pulao served with crispy fried fish pieces.",
    longDescription:
      "Aromatic basmati pulao paired with spiced fried fish for a satisfying rice-and-seafood combination.",
    category: "rice",
    diet: "non-veg",
    price: 159,
  }),
  item({
    slug: "mutton-liver-fry-pulao",
    name: "Mutton Liver Fry Pulao",
    description: "Pulao topped with spiced mutton liver fry.",
    longDescription:
      "Fragrant pulao rice served with boldly spiced mutton liver fry — rich, earthy, and deeply flavourful.",
    category: "rice",
    diet: "non-veg",
    price: 199,
  }),
];

const NON_VEG_CURRIES_FRY = [
  item({
    slug: "chicken-curry",
    name: "Chicken Curry",
    description: "Homestyle chicken curry with onion-tomato masala.",
    longDescription:
      "Tender chicken cooked in a spiced onion-tomato gravy — comforting, flavourful, and perfect with rice or roti.",
    category: "curry",
    diet: "non-veg",
    price: 130,
  }),
  item({
    slug: "chicken-liver-fry",
    name: "Chicken Liver Fry",
    description: "Spiced chicken liver fry with curry leaves and onions.",
    longDescription:
      "Chicken liver sautéed with onions, green chillies, and curry leaves for a bold, rustic Andhra-style fry.",
    category: "curry",
    diet: "non-veg",
    price: 100,
  }),
  item({
    slug: "mutton-liver-fry",
    name: "Mutton Liver Fry",
    description: "Rich mutton liver fry with aromatic spices.",
    longDescription:
      "Mutton liver cooked with onions and spices until tender — a traditional delicacy with deep, savoury flavour.",
    category: "curry",
    diet: "non-veg",
    price: 200,
  }),
  item({
    slug: "chicken-joints",
    name: "Chicken Joints",
    description: "Spiced chicken joint pieces, pan-fried or roasted.",
    longDescription:
      "Chicken joint pieces marinated in house spices and cooked until flavourful and tender.",
    category: "curry",
    diet: "non-veg",
    price: 70,
  }),
  item({
    slug: "garlic-chicken-fry",
    name: "Garlic Chicken Fry",
    description: "Chicken fry with bold garlic and pepper seasoning.",
    longDescription:
      "Chicken pieces tossed with generous garlic, pepper, and spices for an aromatic, dry-style fry.",
    category: "curry",
    diet: "non-veg",
    price: 140,
  }),
  item({
    slug: "egg-burji",
    name: "Egg Burji",
    description: "Scrambled eggs with onion, tomato, and spices.",
    longDescription:
      "Fluffy scrambled eggs cooked with onions, tomatoes, and mild spices — a quick, satisfying side or meal.",
    category: "curry",
    diet: "egg",
    price: 70,
  }),
  item({
    slug: "tomato-munagakaaya-egg-curry",
    name: "Tomato Munagakaaya Egg Curry",
    description: "Egg curry with tomato and drumstick (munagakaaya).",
    longDescription:
      "Boiled eggs simmered in a tangy tomato gravy with drumstick pieces — a homestyle Telangana favourite.",
    category: "curry",
    diet: "egg",
    price: 60,
  }),
];

const VEG_DAL_PACHADI = [
  item({
    slug: "tomato-pappu",
    name: "Tomato Pappu",
    description: "Telangana-style tomato dal tempered with spices.",
    longDescription:
      "Yellow lentils cooked with ripe tomatoes and tempered with mustard, cumin, and curry leaves.",
    category: "curry",
    diet: "veg",
    price: 40,
  }),
  item({
    slug: "pesara-pappu",
    name: "Pesara Pappu",
    description: "Green gram dal cooked with mild seasoning.",
    longDescription:
      "Moong dal simmered to a soft consistency and finished with a simple, aromatic tempering.",
    category: "curry",
    diet: "veg",
    price: 40,
  }),
  item({
    slug: "sambar",
    name: "Sambar",
    description: "South Indian sambar with vegetables and tamarind.",
    longDescription:
      "Classic sambar with mixed vegetables, tamarind, and sambar powder — pairs well with rice or idli.",
    category: "curry",
    diet: "veg",
    price: 40,
  }),
  item({
    slug: "tomato-chaaru",
    name: "Tomato Chaaru",
    description: "Light tomato rasam with pepper and tamarind.",
    longDescription:
      "A thin, tangy tomato chaaru (rasam) spiced with pepper and cumin — soothing and appetizing.",
    category: "curry",
    diet: "veg",
    price: 40,
  }),
  item({
    slug: "aloo-fry",
    name: "Aloo Fry",
    description: "Crispy pan-fried potato cubes with spices.",
    longDescription:
      "Potato cubes tossed with turmeric, chilli, and curry leaves until golden and crisp.",
    category: "curry",
    diet: "veg",
    price: 50,
  }),
  item({
    slug: "dondakaaya-fry",
    name: "Dondakaaya Fry",
    description: "Ivy gourd (dondakaaya) stir-fried with spices.",
    longDescription:
      "Fresh ivy gourd sliced and sautéed with onions and spices for a crunchy, homestyle vegetable fry.",
    category: "curry",
    diet: "veg",
    price: 50,
  }),
  item({
    slug: "tomato-pachadi",
    name: "Tomato Pachadi",
    description: "Fresh tomato chutney with tempering.",
    longDescription:
      "Ripe tomatoes ground into a tangy pachadi and finished with a mustard-curry leaf tempering.",
    category: "curry",
    diet: "veg",
    price: 40,
  }),
  item({
    slug: "gongura-pachadi",
    name: "Gongura Pachadi",
    description: "Tangy sorrel leaf chutney — Andhra classic.",
    longDescription:
      "Gongura (sorrel) leaves pounded into a sharp, tangy pachadi that pairs beautifully with rice and ghee.",
    category: "curry",
    diet: "veg",
    price: 60,
  }),
  item({
    slug: "cauliflower-tomato-koora",
    name: "Cauliflower Tomato Koora",
    description: "Cauliflower and tomato dry curry.",
    longDescription:
      "Cauliflower florets cooked with tomatoes and mild spices for a simple, wholesome vegetable koora.",
    category: "curry",
    diet: "veg",
    price: 40,
  }),
];

const BREADS_PARATHAS = [
  item({
    slug: "chapathi",
    name: "Chapathi",
    description: "Soft whole-wheat chapathi, freshly made.",
    longDescription:
      "Soft, lightly layered whole-wheat chapathi — ideal with curries, dal, or pachadi.",
    category: "bread",
    diet: "veg",
    price: 15,
  }),
  item({
    slug: "parathaa",
    name: "Parathaa",
    description: "Flaky layered parathaa, pan-roasted.",
    longDescription:
      "Golden parathaa with flaky layers, roasted on the tawa with a touch of ghee.",
    category: "bread",
    diet: "veg",
    price: 20,
  }),
  item({
    slug: "egg-parathaa",
    name: "Egg Parathaa",
    description: "Parathaa stuffed with spiced scrambled egg.",
    longDescription:
      "Flaky parathaa folded with seasoned egg filling — hearty and filling on its own.",
    category: "bread",
    diet: "egg",
    price: 80,
  }),
  item({
    slug: "chicken-parathaa",
    name: "Chicken Parathaa",
    description: "Parathaa stuffed with spiced minced chicken.",
    longDescription:
      "Soft parathaa packed with flavourful chicken keema-style filling — a satisfying meal in one.",
    category: "bread",
    diet: "non-veg",
    price: 129,
    isFeatured: true,
  }),
  item({
    slug: "chicken-liver-fry-parathaa",
    name: "Chicken Liver Fry Parathaa",
    description: "Parathaa stuffed with chicken liver fry.",
    longDescription:
      "Parathaa filled with spiced chicken liver fry for a rich, bold flavour — a specialty wrap.",
    category: "bread",
    diet: "non-veg",
    price: 100,
  }),
  item({
    slug: "mutton-liver-fry-parathaa",
    name: "Mutton Liver Fry Parathaa",
    description: "Parathaa stuffed with mutton liver fry.",
    longDescription:
      "Flaky parathaa with a generous mutton liver fry filling — deep, savoury, and deeply satisfying.",
    category: "bread",
    diet: "non-veg",
    price: 150,
  }),
];

export const MENU_ITEMS: MenuItem[] = [
  ...STARTERS_FRY,
  ...PULAO_RICE,
  ...NON_VEG_CURRIES_FRY,
  ...VEG_DAL_PACHADI,
  ...BREADS_PARATHAS,
];

export function getFeaturedMenuItems(): MenuItem[] {
  return MENU_ITEMS.filter((menuItem) => menuItem.isFeatured);
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return MENU_ITEMS.find((menuItem) => menuItem.id === id);
}

export function getMenuItemBySlug(slug: string): MenuItem | undefined {
  return MENU_ITEMS.find((menuItem) => menuItem.slug === slug);
}

export function filterMenuItems(options: {
  category?: string;
  diet?: string;
  search?: string;
}): MenuItem[] {
  const { category = "all", diet = "all", search = "" } = options;
  const query = search.trim().toLowerCase();

  return MENU_ITEMS.filter((menuItem) => {
    if (category !== "all" && menuItem.category !== category) {
      return false;
    }
    if (diet !== "all" && menuItem.diet !== diet) {
      return false;
    }
    if (query && !menuItem.name.toLowerCase().includes(query)) {
      return false;
    }
    return true;
  });
}
