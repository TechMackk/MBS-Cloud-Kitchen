// SEED DATA ONLY. Public pages now read from DB. Edit menu items via /admin/menu.

import type { DietType, MenuCategory } from "@/lib/data/categories";
import { MENU_IMAGES } from "@/lib/data/menu-images";
import {
  buildPrepNotes,
  getStarterVariant,
} from "@/lib/data/menu-prep";

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
}

type ItemInput = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: MenuCategory;
  diet: DietType;
  price: number;
  imageUrl: string;
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
    imageUrl: input.imageUrl,
    isAvailable: true,
    isFeatured: input.isFeatured ?? false,
    spiceLevel: input.spiceLevel,
    servingSize: input.servingSize,
  };
}

const FRIED_RICE = [
  item({
    slug: "egg-fried-rice",
    name: "Egg Fried Rice",
    description:
      "Wok-tossed long-grain rice with scrambled egg, spring onion, and light soy.",
    longDescription:
      "Classic Chinese-style egg fried rice made with premium long-grain rice, fresh eggs, and a touch of soy. Wok-tossed at high heat for that signature smoky flavour — a comforting meal on its own or paired with any starter.",
    category: "fried-rice",
    diet: "egg",
    price: 120,
    imageUrl: MENU_IMAGES.friedRice,
    servingSize: "Serves 1",
  }),
  item({
    slug: "double-egg-fried-rice",
    name: "Double Egg Fried Rice",
    description:
      "Extra egg-loaded fried rice for a richer, protein-packed bowl.",
    longDescription:
      "Our egg fried rice elevated with double the eggs for a richer, fluffier texture. Same wok-tossed technique, same fresh oil — just more of the good stuff for egg lovers.",
    category: "fried-rice",
    diet: "egg",
    price: 130,
    imageUrl: MENU_IMAGES.friedRice,
    servingSize: "Serves 1",
  }),
  item({
    slug: "chicken-fried-rice",
    name: "Chicken Fried Rice",
    description:
      "Tender chicken pieces tossed with fragrant rice and vegetables.",
    longDescription:
      "Juicy chicken strips wok-tossed with long-grain rice, carrots, beans, and spring onion. Seasoned with our house blend — hearty, satisfying, and made fresh to order.",
    category: "fried-rice",
    diet: "non-veg",
    price: 150,
    imageUrl: MENU_IMAGES.friedRice,
    servingSize: "Serves 1",
  }),
  item({
    slug: "veg-fried-rice",
    name: "Veg Fried Rice",
    description:
      "Colourful vegetable fried rice with seasonal produce and mild seasoning.",
    longDescription:
      "A vibrant mix of seasonal vegetables wok-tossed with fragrant basmati rice. Light, wholesome, and packed with crunch — our most popular fried rice for everyday ordering.",
    category: "fried-rice",
    diet: "veg",
    price: 140,
    imageUrl: MENU_IMAGES.friedRice,
    isFeatured: true,
    servingSize: "Serves 1",
  }),
  item({
    slug: "paneer-fried-rice",
    name: "Paneer Fried Rice",
    description:
      "Soft paneer cubes with rice and peppers in a mildly spiced wok toss.",
    longDescription:
      "Creamy paneer cubes paired with colourful peppers and onions, wok-tossed with premium rice. A vegetarian favourite that delivers both protein and flavour in every bite.",
    category: "fried-rice",
    diet: "veg",
    price: 190,
    imageUrl: MENU_IMAGES.friedRice,
    servingSize: "Serves 1",
  }),
  item({
    slug: "prawns-fried-rice-with-egg",
    name: "Prawns Fried Rice with Egg",
    description:
      "Fresh prawns and egg with rice — a seafood lover's fried rice special.",
    longDescription:
      "Succulent prawns and fluffy scrambled egg wok-tossed with long-grain rice and spring onion. Fresh seafood prepped same day, never frozen — a premium bowl for special cravings.",
    category: "fried-rice",
    diet: "non-veg",
    price: 250,
    imageUrl: MENU_IMAGES.prawns,
    servingSize: "Serves 1",
  }),
];

const RICE = [
  item({
    slug: "jeera-rice",
    name: "Jeera Rice",
    description:
      "Fragrant basmati rice tempered with roasted cumin seeds and ghee.",
    longDescription:
      "Premium basmati rice cooked with ghee and roasted cumin seeds for an aromatic, fluffy side. The perfect companion to biryanis, curries, and Chinese mains alike.",
    category: "rice",
    diet: "veg",
    price: 130,
    imageUrl: MENU_IMAGES.rice,
    servingSize: "Serves 1",
  }),
];

const NOODLES = [
  item({
    slug: "egg-noodles",
    name: "Egg Noodles",
    description: "Stir-fried noodles with egg, vegetables, and light seasoning.",
    longDescription:
      "Quality noodles wok-tossed with fresh egg and crisp vegetables. A quick, satisfying meal with the smoky wok flavour that defines good Chinese street food.",
    category: "noodles",
    diet: "egg",
    price: 110,
    imageUrl: MENU_IMAGES.noodles,
    servingSize: "Serves 1",
  }),
  item({
    slug: "chicken-noodles",
    name: "Chicken Noodles",
    description: "Tender chicken with stir-fried noodles and mixed vegetables.",
    longDescription:
      "Juicy chicken strips tossed with quality noodles and seasonal vegetables at high heat. Fresh oil, bold flavours, and a portion that hits the spot every time.",
    category: "noodles",
    diet: "non-veg",
    price: 150,
    imageUrl: MENU_IMAGES.noodles,
    servingSize: "Serves 1",
  }),
  item({
    slug: "veg-noodles",
    name: "Veg Noodles",
    description: "Garden-fresh vegetables tossed with silky stir-fried noodles.",
    longDescription:
      "A colourful medley of vegetables wok-tossed with quality noodles. Light, fresh, and full of texture — a vegetarian staple on our Chinese menu.",
    category: "noodles",
    diet: "veg",
    price: 110,
    imageUrl: MENU_IMAGES.noodles,
    servingSize: "Serves 1",
  }),
  item({
    slug: "paneer-noodles",
    name: "Paneer Noodles",
    description: "Soft paneer and noodles in a mildly spiced wok toss.",
    longDescription:
      "Creamy paneer cubes combined with stir-fried noodles and peppers. A hearty vegetarian option that balances protein with the comfort of classic Chinese noodles.",
    category: "noodles",
    diet: "veg",
    price: 190,
    imageUrl: MENU_IMAGES.noodles,
    servingSize: "Serves 1",
  }),
  item({
    slug: "prawns-noodles-with-egg",
    name: "Prawns Noodles with Egg",
    description: "Fresh prawns and egg with wok-tossed noodles.",
    longDescription:
      "Plump prawns and scrambled egg tossed with quality noodles at high heat. Seafood cleaned and prepped same day — never frozen, always fresh.",
    category: "noodles",
    diet: "non-veg",
    price: 250,
    imageUrl: MENU_IMAGES.prawns,
    servingSize: "Serves 1",
  }),
  item({
    slug: "chicken-65-noodles",
    name: "Chicken 65 Noodles",
    description: "Spicy Chicken 65 pieces tossed with stir-fried noodles.",
    longDescription:
      "Our fiery Chicken 65 combined with wok-tossed noodles for a fusion bowl that brings Hyderabad heat to Chinese comfort food. Bold, spicy, and unforgettable.",
    category: "noodles",
    diet: "non-veg",
    price: 220,
    imageUrl: MENU_IMAGES.noodles,
    spiceLevel: 3,
    servingSize: "Serves 1",
  }),
];

const STARTERS = [
  item({
    slug: "veg-manchurian",
    name: "Veg Manchurian",
    description: "Crispy vegetable balls in tangy Indo-Chinese gravy.",
    longDescription:
      "Golden-fried vegetable dumplings tossed in a tangy, slightly sweet Manchurian sauce. A vegetarian classic that pairs perfectly with fried rice or noodles.",
    category: "starter",
    diet: "veg",
    price: 140,
    imageUrl: MENU_IMAGES.vegStarter,
    isFeatured: true,
    spiceLevel: 2,
  }),
  item({
    slug: "chicken-manchurian",
    name: "Chicken Manchurian",
    description: "Juicy chicken in signature tangy Manchurian sauce.",
    longDescription:
      "Tender chicken pieces coated and fried, then tossed in our house Manchurian gravy — tangy, slightly sweet, and loaded with capsicum and spring onion.",
    category: "starter",
    diet: "non-veg",
    price: 220,
    imageUrl: MENU_IMAGES.chickenStarter,
    isFeatured: true,
    spiceLevel: 2,
  }),
  item({
    slug: "pepper-chicken",
    name: "Pepper Chicken",
    description: "Black pepper-coated chicken with bold, aromatic heat.",
    longDescription:
      "Chicken pieces stir-fried with crushed black pepper, curry leaves, and garlic. A dry starter with deep aroma and controlled heat — perfect as a side or snack.",
    category: "starter",
    diet: "non-veg",
    price: 220,
    imageUrl: MENU_IMAGES.chickenStarter,
    spiceLevel: 2,
  }),
  item({
    slug: "chilli-chicken",
    name: "Chilli Chicken",
    description: "Crispy chicken tossed with onions and green chillies.",
    longDescription:
      "Classic Indo-Chinese chilli chicken — crispy fried chicken tossed with onions, capsicum, and green chillies in a spicy soy-ginger sauce.",
    category: "starter",
    diet: "non-veg",
    price: 220,
    imageUrl: MENU_IMAGES.chickenStarter,
    spiceLevel: 3,
  }),
  item({
    slug: "chicken-65",
    name: "Chicken 65",
    description: "Hyderabad's iconic spicy, crispy fried chicken starter.",
    longDescription:
      "Marinated chicken deep-fried until crispy, then tossed with curry leaves, green chillies, and yogurt tempering. Hyderabad's most beloved starter — fiery, crunchy, and addictive.",
    category: "starter",
    diet: "non-veg",
    price: 220,
    imageUrl: MENU_IMAGES.chickenStarter,
    isFeatured: true,
    spiceLevel: 3,
  }),
  item({
    slug: "chicken-majestic",
    name: "Chicken Majestic",
    description: "Creamy, mildly spiced chicken starter with Andhra flair.",
    longDescription:
      "Tender chicken strips in a rich, creamy marinade with subtle Andhra spices. A milder alternative to Chicken 65 that still delivers on flavour and texture.",
    category: "starter",
    diet: "non-veg",
    price: 270,
    imageUrl: MENU_IMAGES.chickenStarter,
    spiceLevel: 2,
  }),
  item({
    slug: "chilli-prawns",
    name: "Chilli Prawns",
    description: "Fresh prawns tossed with chillies and Indo-Chinese sauce.",
    longDescription:
      "Plump prawns stir-fried with onions, capsicum, and green chillies in a spicy sauce. Fresh seafood, never frozen — cleaned and prepped same day.",
    category: "starter",
    diet: "non-veg",
    price: 279,
    imageUrl: MENU_IMAGES.prawns,
    spiceLevel: 3,
  }),
  item({
    slug: "garlic-prawns",
    name: "Garlic Prawns",
    description: "Butter-garlic prawns with mild, aromatic seasoning.",
    longDescription:
      "Fresh prawns sautéed in butter and garlic with a hint of pepper. A milder seafood starter that lets the natural sweetness of prawns shine through.",
    category: "starter",
    diet: "non-veg",
    price: 330,
    imageUrl: MENU_IMAGES.prawns,
    spiceLevel: 1,
  }),
  item({
    slug: "loose-prawns",
    name: "Loose Prawns",
    description: "Spiced loose prawn preparation with Andhra-style masala.",
    longDescription:
      "Prawns cooked in a loose, flavourful masala with onions and curry leaves. A rustic seafood starter rooted in South Indian home cooking.",
    category: "starter",
    diet: "non-veg",
    price: 330,
    imageUrl: MENU_IMAGES.prawns,
    spiceLevel: 2,
  }),
  item({
    slug: "garlic-fish-boneless",
    name: "Garlic Fish Boneless",
    description: "Boneless fish fillets in butter-garlic sauce.",
    longDescription:
      "Tender boneless fish fillets sautéed in butter and garlic. Fresh fish, never frozen — a mild, aromatic starter for seafood lovers.",
    category: "starter",
    diet: "non-veg",
    price: 260,
    imageUrl: MENU_IMAGES.fish,
    spiceLevel: 1,
  }),
  item({
    slug: "chilli-fish-boneless",
    name: "Chilli Fish Boneless",
    description: "Crispy boneless fish with spicy Indo-Chinese coating.",
    longDescription:
      "Boneless fish pieces fried crisp and tossed with onions, capsicum, and green chillies. Fresh fish prepped same day with a fiery Indo-Chinese finish.",
    category: "starter",
    diet: "non-veg",
    price: 260,
    imageUrl: MENU_IMAGES.fish,
    spiceLevel: 3,
  }),
  item({
    slug: "gobi-manchurian",
    name: "Gobi Manchurian",
    description: "Crispy cauliflower florets in tangy Manchurian gravy.",
    longDescription:
      "Cauliflower florets battered, fried golden, and tossed in tangy Manchurian sauce. A vegetarian favourite with the perfect balance of crunch and sauce.",
    category: "starter",
    diet: "veg",
    price: 160,
    imageUrl: MENU_IMAGES.vegStarter,
    spiceLevel: 2,
  }),
  item({
    slug: "chilli-paneer",
    name: "Chilli Paneer",
    description: "Crispy paneer cubes tossed with peppers and spicy sauce.",
    longDescription:
      "Golden-fried paneer cubes tossed with onions, capsicum, and green chillies in a spicy Indo-Chinese sauce. A vegetarian staple with serious heat.",
    category: "starter",
    diet: "veg",
    price: 220,
    imageUrl: MENU_IMAGES.vegStarter,
    spiceLevel: 3,
  }),
  item({
    slug: "paneer-65",
    name: "Paneer 65",
    description: "Spicy, crispy fried paneer inspired by Chicken 65.",
    longDescription:
      "Paneer cubes marinated in our 65 spice blend, fried until crispy, and tossed with curry leaves and chillies. All the fire of Chicken 65, fully vegetarian.",
    category: "starter",
    diet: "veg",
    price: 220,
    imageUrl: MENU_IMAGES.vegStarter,
    spiceLevel: 3,
  }),
  item({
    slug: "baby-corn-manchurian",
    name: "Baby Corn Manchurian",
    description: "Crispy baby corn in classic Manchurian sauce.",
    longDescription:
      "Tender baby corn coated and fried, then tossed in tangy Manchurian gravy. A crunchy vegetarian starter with a satisfying sweet-spicy kick.",
    category: "starter",
    diet: "veg",
    price: 219,
    imageUrl: MENU_IMAGES.vegStarter,
    spiceLevel: 2,
  }),
  item({
    slug: "chilli-mushroom",
    name: "Chilli Mushroom",
    description: "Button mushrooms tossed with peppers and spicy sauce.",
    longDescription:
      "Fresh button mushrooms stir-fried with onions, capsicum, and green chillies. Earthy, spicy, and perfect alongside fried rice or noodles.",
    category: "starter",
    diet: "veg",
    price: 210,
    imageUrl: MENU_IMAGES.vegStarter,
    spiceLevel: 2,
  }),
  item({
    slug: "chicken-roast-with-batani",
    name: "Chicken Roast with Batani",
    description: "Roasted chicken with green peas in rustic Andhra style.",
    longDescription:
      "Chicken pieces slow-roasted with green peas (batani), onions, and Telangana spices. A homestyle starter that bridges Chinese menu favourites with local flavour.",
    category: "starter",
    diet: "non-veg",
    price: 230,
    imageUrl: MENU_IMAGES.chickenStarter,
    spiceLevel: 2,
  }),
];

const BIRYANI = [
  item({
    slug: "hyderabadi-chicken-dum-biryani-single",
    name: "Hyderabadi Chicken Dum Biryani (Single)",
    description:
      "Single portion of authentic dum biryani with tender chicken and basmati rice.",
    longDescription:
      "Fragrant basmati rice layered with marinated chicken, fried onions, mint, and saffron — sealed and slow-cooked in the traditional dum style. Hyderabad's crown jewel in a single serving.",
    category: "biryani",
    diet: "non-veg",
    price: 150,
    imageUrl: MENU_IMAGES.biryani,
    isFeatured: true,
    spiceLevel: 2,
    servingSize: "Single",
  }),
  item({
    slug: "hyderabadi-chicken-dum-biryani-full",
    name: "Hyderabadi Chicken Dum Biryani (Full)",
    description: "Full portion dum biryani — ideal for sharing or a hearty meal.",
    longDescription:
      "A generous full portion of our signature Hyderabadi Chicken Dum Biryani. Layered rice and chicken slow-cooked with pure ghee and authentic spice blend — enough for two hungry appetites.",
    category: "biryani",
    diet: "non-veg",
    price: 280,
    imageUrl: MENU_IMAGES.biryani,
    spiceLevel: 2,
    servingSize: "Full",
  }),
  item({
    slug: "hyderabadi-chicken-dum-biryani-family",
    name: "Hyderabadi Chicken Dum Biryani (Family Pack)",
    description: "Family pack dum biryani for gatherings and group orders.",
    longDescription:
      "Our largest portion of Hyderabadi Chicken Dum Biryani — perfect for family dinners and group orders. Same authentic dum technique, same premium ingredients, scaled for sharing.",
    category: "biryani",
    diet: "non-veg",
    price: 540,
    imageUrl: MENU_IMAGES.biryani,
    spiceLevel: 2,
    servingSize: "Family Pack",
  }),
  item({
    slug: "garlic-chicken-fry-piece-biryani-single",
    name: "Garlic Chicken Fry Piece Biryani (Single)",
    description: "Dum biryani topped with crispy garlic chicken fry pieces.",
    longDescription:
      "Classic dum biryani elevated with crispy garlic chicken fry pieces on top. The crunch of fried chicken meets fragrant rice — a MBS signature combination.",
    category: "biryani",
    diet: "non-veg",
    price: 160,
    imageUrl: MENU_IMAGES.biryani,
    spiceLevel: 2,
    servingSize: "Single",
  }),
  item({
    slug: "garlic-chicken-fry-piece-biryani-full",
    name: "Garlic Chicken Fry Piece Biryani (Full)",
    description: "Full portion biryani with generous garlic chicken fry topping.",
    longDescription:
      "A full portion of fragrant dum biryani crowned with a generous layer of garlic chicken fry pieces. Perfect for sharing when you want both rice and crispy chicken.",
    category: "biryani",
    diet: "non-veg",
    price: 299,
    imageUrl: MENU_IMAGES.biryani,
    spiceLevel: 2,
    servingSize: "Full",
  }),
  item({
    slug: "garlic-chicken-fry-piece-biryani-family",
    name: "Garlic Chicken Fry Piece Biryani (Family Pack)",
    description: "Family pack with garlic chicken fry pieces over dum biryani.",
    longDescription:
      "Feed the whole family with our largest garlic chicken fry piece biryani. Dum-cooked rice with a mountain of crispy garlic chicken on top — a crowd-pleaser every time.",
    category: "biryani",
    diet: "non-veg",
    price: 580,
    imageUrl: MENU_IMAGES.biryani,
    spiceLevel: 2,
    servingSize: "Family Pack",
  }),
  item({
    slug: "boneless-fish-biryani",
    name: "Boneless Fish Biryani",
    description: "Dum biryani with marinated boneless fish pieces.",
    longDescription:
      "Fragrant basmati rice layered with marinated boneless fish and slow-cooked in dum style. Fresh fish, never frozen — a seafood twist on the Hyderabadi classic.",
    category: "biryani",
    diet: "non-veg",
    price: 249,
    imageUrl: MENU_IMAGES.fish,
    spiceLevel: 2,
    servingSize: "Single",
  }),
  item({
    slug: "prawns-biryani",
    name: "Prawns Biryani",
    description: "Aromatic dum biryani with succulent prawns.",
    longDescription:
      "Premium prawns marinated and layered with basmati rice, then dum-cooked with saffron and fried onions. Fresh seafood meets Hyderabadi tradition.",
    category: "biryani",
    diet: "non-veg",
    price: 250,
    imageUrl: MENU_IMAGES.prawns,
    spiceLevel: 2,
    servingSize: "Single",
  }),
  item({
    slug: "paneer-biryani",
    name: "Paneer Biryani",
    description: "Vegetarian dum biryani with spiced paneer and basmati rice.",
    longDescription:
      "Soft paneer cubes marinated in aromatic spices, layered with basmati rice and dum-cooked. A vegetarian biryani that doesn't compromise on the authentic Hyderabadi experience.",
    category: "biryani",
    diet: "veg",
    price: 170,
    imageUrl: MENU_IMAGES.biryani,
    spiceLevel: 2,
    servingSize: "Single",
  }),
  item({
    slug: "veg-biryani",
    name: "Veg Biryani",
    description: "Classic vegetable dum biryani with seasonal produce.",
    longDescription:
      "Seasonal vegetables layered with fragrant basmati rice and slow-cooked in the dum tradition. Wholesome, aromatic, and true to Hyderabadi roots — our vegetarian bestseller.",
    category: "biryani",
    diet: "veg",
    price: 149,
    imageUrl: MENU_IMAGES.biryani,
    isFeatured: true,
    spiceLevel: 1,
    servingSize: "Single",
  }),
  item({
    slug: "chicken-65-biryani",
    name: "Chicken 65 Biryani",
    description: "Dum biryani topped with spicy Chicken 65 pieces.",
    longDescription:
      "Fragrant dum biryani crowned with our fiery Chicken 65 pieces — a dramatic fusion of Hyderabadi tradition and bold South Indian spice.",
    category: "biryani",
    diet: "non-veg",
    price: 179,
    imageUrl: MENU_IMAGES.biryani,
    spiceLevel: 3,
    servingSize: "Single",
  }),
];

export const MENU_ITEMS: MenuItem[] = [
  ...FRIED_RICE,
  ...RICE,
  ...NOODLES,
  ...STARTERS,
  ...BIRYANI,
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
