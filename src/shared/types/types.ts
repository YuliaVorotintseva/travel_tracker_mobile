import { SelectOption } from "../ui";
import { Trips } from "./api/generated";

export type Theme = "light" | "dark";

export type Currency = "USD" | "EUR" | "RUB" | "GBP";

export type TripWithMembers = Trips & {
  trip_members: {
    user_id: string;
    role: "owner" | "editor" | "viewer";
  }[];
};

export const CURRENCIES: SelectOption<Currency>[] = [
  { label: "USD 🇺🇸", value: "USD" },
  { label: "EUR 🇪🇺", value: "EUR" },
  { label: "RUB 🇷🇺", value: "RUB" },
  { label: "GBP 🇬🇧", value: "GBP" },
];
