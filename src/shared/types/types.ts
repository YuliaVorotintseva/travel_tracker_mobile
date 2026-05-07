import { SelectOption } from "../ui";

export type Theme = "light" | "dark";

export type Currency = "USD" | "EUR" | "RUB" | "GBP";

export type Trip = {
  id: string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  destination?: string;
  currency?: Currency;
  created_by: string;
  created_at?: string;
};

export type TripWithMembers = {
  id: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  destination: string | null;
  currency: string;
  created_by: string;
  trip_members: {
    user_id: string;
    role: "owner" | "editor" | "viewer";
  }[];
  created_at?: string;
};

export type UserProfile = {
  id: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  email: string;
};

export type TripMemberType = {
  trip_id: string;
  user_id: string;
  role: "owner" | "editor" | "viewer";
  joined_at: string;
};

export const CURRENCIES: SelectOption<Currency>[] = [
  { label: "USD 🇺🇸", value: "USD" },
  { label: "EUR 🇪🇺", value: "EUR" },
  { label: "RUB 🇷🇺", value: "RUB" },
  { label: "GBP 🇬🇧", value: "GBP" },
];
