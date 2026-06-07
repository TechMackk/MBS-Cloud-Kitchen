"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createMenuItem,
  updateMenuItem,
} from "@/app/admin/menu/actions";
import { ImageUpload } from "@/components/admin/forms/ImageUpload";
import { MenuTagsField } from "@/components/admin/forms/MenuTagsField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  CATEGORY_LABELS,
  DIET_LABELS,
  MENU_CATEGORIES,
  type MenuCategory,
} from "@/lib/data/categories";
import type { MenuItem } from "@/lib/data/menu";
import { slugify } from "@/lib/utils/slugify";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Invalid slug"),
  category: z.string().min(1),
  diet: z.enum(["veg", "non-veg", "egg"]),
  price: z.coerce.number().min(1),
  description: z.string().min(1).max(150),
  longDescription: z.string().min(1).max(1000),
  prepNotes: z.array(z.object({ value: z.string().min(1) })).min(1),
  spiceLevel: z.enum(["none", "1", "2", "3"]),
  servingSize: z.string().optional(),
  calories: z.union([z.coerce.number().int().min(0), z.literal("")]).optional(),
  protein: z.union([z.coerce.number().int().min(0), z.literal("")]).optional(),
  tags: z.array(z.string().min(1)).max(10),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export interface MenuItemFormProps {
  mode: "create" | "edit";
  initialData?: MenuItem;
}

export function MenuItemForm({ mode, initialData }: MenuItemFormProps) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      category: initialData?.category ?? "starter",
      diet: initialData?.diet ?? "veg",
      price: initialData?.price ?? 0,
      description: initialData?.description ?? "",
      longDescription: initialData?.longDescription ?? "",
      prepNotes: (initialData?.prepNotes ?? [""]).map((note) => ({
        value: note,
      })),
      spiceLevel: initialData?.spiceLevel
        ? String(initialData.spiceLevel) as "1" | "2" | "3"
        : "none",
      servingSize: initialData?.servingSize ?? "",
      calories: initialData?.calories ?? "",
      protein: initialData?.protein ?? "",
      tags: initialData?.tags ?? [],
      isAvailable: initialData?.isAvailable ?? true,
      isFeatured: initialData?.isFeatured ?? false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prepNotes",
  });

  const nameValue = watch("name");

  useEffect(() => {
    if (!slugTouched && mode === "create" && nameValue) {
      setValue("slug", slugify(nameValue));
    }
  }, [nameValue, slugTouched, mode, setValue]);

  async function onSubmit(values: FormValues) {
    if (mode === "create" && !imageFile) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("slug", values.slug);
    formData.set("category", values.category);
    formData.set("diet", values.diet);
    formData.set("price", String(values.price));
    formData.set("description", values.description);
    formData.set("longDescription", values.longDescription);
    formData.set(
      "prepNotes",
      JSON.stringify(values.prepNotes.map((n) => n.value)),
    );
    formData.set("spiceLevel", values.spiceLevel);
    formData.set("servingSize", values.servingSize ?? "");
    formData.set(
      "calories",
      values.calories === "" || values.calories === undefined
        ? ""
        : String(values.calories),
    );
    formData.set(
      "protein",
      values.protein === "" || values.protein === undefined
        ? ""
        : String(values.protein),
    );
    formData.set("tags", JSON.stringify(values.tags));
    formData.set("isAvailable", String(values.isAvailable));
    formData.set("isFeatured", String(values.isFeatured));

    if (imageFile) {
      formData.set("image", imageFile);
    }

    const result =
      mode === "create"
        ? await createMenuItem(formData)
        : await updateMenuItem(initialData?.slug ?? values.slug, formData);

    if (result.success) {
      toast.success(
        mode === "create" ? "Menu item created" : "Menu item updated",
      );
      router.push("/admin/menu");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" error={Boolean(errors.name)} {...register("name")} />
          {errors.name && (
            <p className="text-sm text-orange">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            readOnly={mode === "edit"}
            error={Boolean(errors.slug)}
            {...register("slug", {
              onChange: () => setSlugTouched(true),
            })}
          />
          {errors.slug && (
            <p className="text-sm text-orange">{errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={watch("category")}
            onValueChange={(v) => setValue("category", v as MenuCategory)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {MENU_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            min={1}
            error={Boolean(errors.price)}
            {...register("price")}
          />
          {errors.price && (
            <p className="text-sm text-orange">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Diet *</Label>
        <RadioGroup
          value={watch("diet")}
          onValueChange={(v) =>
            setValue("diet", v as FormValues["diet"])
          }
          className="flex flex-wrap gap-4"
        >
          {(["veg", "non-veg", "egg"] as const).map((diet) => (
            <div key={diet} className="flex items-center gap-2">
              <RadioGroupItem value={diet} id={`diet-${diet}`} />
              <Label htmlFor={`diet-${diet}`} className="font-normal">
                {DIET_LABELS[diet]}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Short Description *</Label>
        <Input
          id="description"
          maxLength={150}
          error={Boolean(errors.description)}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-orange">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="longDescription">Long Description *</Label>
        <Textarea
          id="longDescription"
          maxLength={1000}
          error={Boolean(errors.longDescription)}
          {...register("longDescription")}
        />
        {errors.longDescription && (
          <p className="text-sm text-orange">
            {errors.longDescription.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Prep Notes *</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => append({ value: "" })}
            disabled={fields.length >= 10}
            className="gap-1"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add note
          </Button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              {...register(`prepNotes.${index}.value`)}
              placeholder="Preparation note"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
              aria-label="Remove prep note"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Label>Spice Level</Label>
        <RadioGroup
          value={watch("spiceLevel")}
          onValueChange={(v) =>
            setValue("spiceLevel", v as FormValues["spiceLevel"])
          }
          className="flex flex-wrap gap-4"
        >
          {(["none", "1", "2", "3"] as const).map((level) => (
            <div key={level} className="flex items-center gap-2">
              <RadioGroupItem value={level} id={`spice-${level}`} />
              <Label htmlFor={`spice-${level}`} className="font-normal">
                {level === "none" ? "None" : level}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="servingSize">Serving Size</Label>
        <Input
          id="servingSize"
          placeholder="Serves 1"
          {...register("servingSize")}
        />
      </div>

      <div className="space-y-3 rounded-xl border border-green-soft/20 bg-cream/20 p-4">
        <div>
          <Label className="text-base">Nutrition (Optional)</Label>
          <p className="mt-1 text-xs text-text/60">Leave blank if unknown</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="calories">Calories (kcal)</Label>
            <Input
              id="calories"
              type="number"
              min={0}
              placeholder="e.g. 480"
              {...register("calories")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              type="number"
              min={0}
              placeholder="e.g. 42"
              {...register("protein")}
            />
          </div>
        </div>
      </div>

      <MenuTagsField
        value={watch("tags")}
        onChange={(tags) => setValue("tags", tags)}
      />

      <div className="space-y-2">
        <Label>Image {mode === "create" ? "*" : ""}</Label>
        <ImageUpload
          currentImageUrl={initialData?.imageUrl}
          required={mode === "create"}
          onFileChange={setImageFile}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <Switch
            id="isAvailable"
            checked={watch("isAvailable")}
            onCheckedChange={(v) => setValue("isAvailable", v)}
          />
          <Label htmlFor="isAvailable">Available</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            id="isFeatured"
            checked={watch("isFeatured")}
            onCheckedChange={(v) => setValue("isFeatured", v)}
          />
          <Label htmlFor="isFeatured">Featured on Home</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : mode === "create"
              ? "Create Menu Item"
              : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/menu")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
