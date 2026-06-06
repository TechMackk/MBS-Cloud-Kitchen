"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createCateringItem,
  updateCateringItem,
} from "@/app/admin/catering/actions";
import { ImageUpload } from "@/components/admin/forms/ImageUpload";
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
import type { CateringItem } from "@/lib/data/catering-menu";
import { slugify } from "@/lib/utils/slugify";

const formSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  category: z.string().min(1),
  diet: z.enum(["veg", "non-veg", "egg"]),
  pricePerPlate: z.coerce.number().min(1),
  description: z.string().min(1).max(500),
  isAvailable: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export interface CateringItemFormProps {
  mode: "create" | "edit";
  initialData?: CateringItem;
}

export function CateringItemForm({ mode, initialData }: CateringItemFormProps) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      category: initialData?.category ?? "starter",
      diet: initialData?.diet ?? "veg",
      pricePerPlate: initialData?.pricePerPlate ?? 0,
      description: initialData?.description ?? "",
      isAvailable: initialData?.isAvailable ?? true,
    },
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
    formData.set("pricePerPlate", String(values.pricePerPlate));
    formData.set("description", values.description);
    formData.set("isAvailable", String(values.isAvailable));

    if (imageFile) {
      formData.set("image", imageFile);
    }

    const result =
      mode === "create"
        ? await createCateringItem(formData)
        : await updateCateringItem(
            initialData?.slug ?? values.slug,
            formData,
          );

    if (result.success) {
      toast.success(
        mode === "create"
          ? "Catering item created"
          : "Catering item updated",
      );
      router.push("/admin/catering");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" error={Boolean(errors.name)} {...register("name")} />
        {errors.name && (
          <p className="text-sm text-orange">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          readOnly={mode === "edit"}
          error={Boolean(errors.slug)}
          {...register("slug", { onChange: () => setSlugTouched(true) })}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={watch("category")}
            onValueChange={(v) => setValue("category", v as MenuCategory)}
          >
            <SelectTrigger>
              <SelectValue />
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
          <Label htmlFor="pricePerPlate">Price per Plate (₹) *</Label>
          <Input
            id="pricePerPlate"
            type="number"
            min={1}
            error={Boolean(errors.pricePerPlate)}
            {...register("pricePerPlate")}
          />
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
              <RadioGroupItem value={diet} id={`cat-diet-${diet}`} />
              <Label htmlFor={`cat-diet-${diet}`} className="font-normal">
                {DIET_LABELS[diet]}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          maxLength={500}
          error={Boolean(errors.description)}
          {...register("description")}
        />
      </div>

      <div className="space-y-2">
        <Label>Image {mode === "create" ? "*" : ""}</Label>
        <ImageUpload
          currentImageUrl={initialData?.imageUrl}
          required={mode === "create"}
          onFileChange={setImageFile}
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="isAvailable"
          checked={watch("isAvailable")}
          onCheckedChange={(v) => setValue("isAvailable", v)}
        />
        <Label htmlFor="isAvailable">Available</Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : mode === "create" ? "Create Item" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/catering")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
