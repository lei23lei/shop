import { z } from "zod";

export const checkoutFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  shipping_email: z.string().email("Invalid email address"),
  shipping_phone: z.string().min(10, "Phone number must be at least 10 digits"),
  shipping_address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zip_code: z.string().min(5, "Zip code must be at least 5 characters"),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
