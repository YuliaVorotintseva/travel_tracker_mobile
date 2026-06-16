import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const profileFormSchema = z.object({
  email: z.email("Enter correct e-mail").min(1, "E-mail is required"),
  full_name: z.string().min(1, "Name is required"),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export const ProfileFormResolver = zodResolver(profileFormSchema);

export const defaultProfileValues = {
  email: "",
  full_name: "",
};
