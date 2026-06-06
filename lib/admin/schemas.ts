import { z } from "zod";

import {
  MENU_CATEGORIES,
  type DietType,
  type MenuCategory,
} from "@/lib/data/categories";

const dietValues = ["veg", "non-veg", "egg"] as const satisfies readonly DietType[];
const categoryValues = MENU_CATEGORIES as readonly MenuCategory[];

export const menuItemFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  category: z.enum(categoryValues as [MenuCategory, ...MenuCategory[]]),
  diet: z.enum(dietValues),
  price: z.coerce.number().min(1, "Price must be at least ₹1"),
  description: z.string().min(1).max(150, "Max 150 characters"),
  longDescription: z.string().min(1).max(1000, "Max 1000 characters"),
  prepNotes: z
    .array(z.string().min(1, "Note cannot be empty"))
    .min(1, "At least one prep note required")
    .max(10, "Maximum 10 prep notes"),
  spiceLevel: z.union([z.literal("none"), z.literal(1), z.literal(2), z.literal(3)]).optional(),
  servingSize: z.string().optional(),
  isAvailable: z.coerce.boolean(),
  isFeatured: z.coerce.boolean(),
});

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

export const cateringItemFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  category: z.enum(categoryValues as [MenuCategory, ...MenuCategory[]]),
  diet: z.enum(dietValues),
  pricePerPlate: z.coerce.number().min(1, "Price must be at least ₹1"),
  description: z.string().min(1).max(500, "Max 500 characters"),
  isAvailable: z.coerce.boolean(),
});

export type CateringItemFormValues = z.infer<typeof cateringItemFormSchema>;

export function parseMenuFormData(formData: FormData) {
  const prepNotesRaw = formData.get("prepNotes");
  let prepNotes: string[] = [];

  if (typeof prepNotesRaw === "string") {
    try {
      const parsed: unknown = JSON.parse(prepNotesRaw);
      if (Array.isArray(parsed)) {
        prepNotes = parsed.filter((n): n is string => typeof n === "string");
      }
    } catch {
      prepNotes = [];
    }
  }

  const spiceRaw = formData.get("spiceLevel");
  let spiceLevel: "none" | 1 | 2 | 3 | undefined;
  if (spiceRaw === "none" || spiceRaw === "" || spiceRaw === null) {
    spiceLevel = "none";
  } else {
    const num = Number(spiceRaw);
    if (num === 1 || num === 2 || num === 3) {
      spiceLevel = num;
    }
  }

  return menuItemFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    diet: formData.get("diet"),
    price: formData.get("price"),
    description: formData.get("description"),
    longDescription: formData.get("longDescription"),
    prepNotes,
    spiceLevel,
    servingSize: formData.get("servingSize") || undefined,
    isAvailable: formData.get("isAvailable") === "true",
    isFeatured: formData.get("isFeatured") === "true",
  });
}

export function parseCateringFormData(formData: FormData) {
  return cateringItemFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    diet: formData.get("diet"),
    pricePerPlate: formData.get("pricePerPlate"),
    description: formData.get("description"),
    isAvailable: formData.get("isAvailable") === "true",
  });
}
