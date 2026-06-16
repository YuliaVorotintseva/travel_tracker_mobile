import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(6, "Password field must be at least 6 characters")
  .regex(/[A-Z]/, "The password must contain a capital letter")
  .regex(/[0-9]/, "The password must contain a number")
  .regex(
    /[~!?@#$%^&*\-+(){}[\]><|"'.,:;]/,
    "The password must contain at least one of the following characters: ~!?@#$%^&*_-+()[]{}></|\"'.,:;",
  );

const signInFormSchema = z.object({
  email: z.email("Enter correct e-mail").min(1, "E-mail is required"),
  password: passwordSchema,
});

export type SignInFormData = z.infer<typeof signInFormSchema>;

export const SignInFormResolver = zodResolver(signInFormSchema);

export const defaultSignInValues: SignInFormData = {
  email: "",
  password: "",
};
