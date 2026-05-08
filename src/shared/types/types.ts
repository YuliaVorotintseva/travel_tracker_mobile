import { SelectOption } from "../ui";
import { Trips } from "./api/generated";

export type Theme = "light" | "dark";

export type Currency = "USD" | "EUR" | "RUB" | "GBP";

export type TripMember = {
  user_id: string;
  role: "owner" | "editor" | "viewer";
};

export type TripWithMembers = Trips & {
  trip_members: TripMember[];
};

export type TripMemberWithProfile = {
  user_id: string;
  role: "owner" | "editor" | "viewer";
  joined_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  }[];
};

export const CURRENCIES: SelectOption<Currency>[] = [
  { label: "USD 🇺🇸", value: "USD" },
  { label: "EUR 🇪🇺", value: "EUR" },
  { label: "RUB 🇷🇺", value: "RUB" },
  { label: "GBP 🇬🇧", value: "GBP" },
];
