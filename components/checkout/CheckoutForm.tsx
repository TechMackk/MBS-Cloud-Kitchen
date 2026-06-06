"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createOrderAction } from "@/app/(public)/checkout/actions";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/lib/cart/store";
import { isValidIndianPhone } from "@/lib/utils/phone";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerPhone: z
    .string()
    .min(10, "Valid phone required")
    .refine(isValidIndianPhone, "Enter a valid Indian phone number"),
  deliveryAddress: z.string().min(5, "Delivery address is required"),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      deliveryAddress: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/menu");
    }
  }, [items.length, router]);

  async function onSubmit(data: CheckoutFormValues) {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const formData = new FormData();
    formData.set("customerName", data.customerName);
    formData.set("customerPhone", data.customerPhone);
    formData.set("deliveryAddress", data.deliveryAddress);
    if (data.notes) formData.set("notes", data.notes);
    formData.set(
      "items",
      JSON.stringify(
        items.map((item) => ({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      ),
    );

    const result = await createOrderAction(formData);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    clearCart();

    toast.success(`Order placed! Number: ${result.data?.orderNumber}`);

    if (result.data?.whatsappUrl) {
      window.open(result.data.whatsappUrl, "_blank", "noopener,noreferrer");
    }

    router.push(`/order/${result.data?.orderNumber}`);
  }

  if (items.length === 0) {
    return null;
  }

  const subtotal = getSubtotal();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2">
          <Label htmlFor="customerName">
            Customer Name <span className="text-orange">*</span>
          </Label>
          <Input
            id="customerName"
            error={Boolean(errors.customerName)}
            {...register("customerName")}
          />
          {errors.customerName && (
            <p className="text-sm text-orange" role="alert">
              {errors.customerName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerPhone">
            Phone (+91) <span className="text-orange">*</span>
          </Label>
          <Input
            id="customerPhone"
            type="tel"
            placeholder="9876543210"
            error={Boolean(errors.customerPhone)}
            {...register("customerPhone")}
          />
          {errors.customerPhone && (
            <p className="text-sm text-orange" role="alert">
              {errors.customerPhone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryAddress">
            Delivery Address <span className="text-orange">*</span>
          </Label>
          <Textarea
            id="deliveryAddress"
            error={Boolean(errors.deliveryAddress)}
            {...register("deliveryAddress")}
          />
          {errors.deliveryAddress && (
            <p className="text-sm text-orange" role="alert">
              {errors.deliveryAddress.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Order Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Allergies, spice preference, delivery instructions..."
            {...register("notes")}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Placing Order…" : "Place Order via WhatsApp"}
        </Button>
      </form>

      <OrderSummary items={items} subtotal={subtotal} />
    </div>
  );
}
