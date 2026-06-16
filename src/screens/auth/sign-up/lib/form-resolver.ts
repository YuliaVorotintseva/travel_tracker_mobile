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

const signUpFormSchema = z
  .object({
    email: z.email("Enter correct e-mail").min(1, "E-mail is required"),
    fullName: z.string().min(1, "Name is required"),
    password: passwordSchema,
    passwordConfirm: passwordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Both passwords must match",
    path: ["passwordConfirm"],
  });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export const SignUpFormResolver = zodResolver(signUpFormSchema);

export const defaultSignUpValues = {
  email: "",
  fullName: "",
  password: "",
  passwordConfirm: "",
};
