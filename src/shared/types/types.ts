import { SelectOption } from "../ui";
import { Activities, Trips } from "./api/generated";

export type Theme = "light" | "dark";

export type Currency = "USD" | "EUR" | "RUB" | "GBP";

export type TripMember = {
  user_id: string;
  role: "owner" | "editor" | "viewer";
};

export type TripWithMembers = Trips & {
  trip_members?: TripMember[];
};

export type TripMemberWithProfile = {
  user_id: string;
  role: "owner" | "editor" | "viewer";
  joined_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export type Activity = Activities & {
  type:
    | "transport"
    | "sightseeing"
    | "food"
    | "rest"
    | "accommodation"
    | "custom";
  location: { lat: number; lng: number; address?: string } | null;
};

export const CURRENCIES: SelectOption<Currency>[] = [
  { label: "USD 🇺🇸", value: "USD" },
  { label: "EUR 🇪🇺", value: "EUR" },
  { label: "RUB 🇷🇺", value: "RUB" },
  { label: "GBP 🇬🇧", value: "GBP" },
];

export const ACTIVITY_TYPES: SelectOption<Activity["type"]>[] = [
  { label: "🏛️ Достопримечательность", value: "sightseeing" },
  { label: "🚗 Транспорт", value: "transport" },
  { label: "🍽️ Еда", value: "food" },
  { label: "🏨 Проживание", value: "accommodation" },
  { label: "☕ Отдых", value: "rest" },
  { label: "📌 Другое", value: "custom" },
];

export const TRIP_MEMBER_ROLE: SelectOption<TripMemberWithProfile["role"]>[] = [
  { label: "Viewer", value: "viewer" },
  { label: "Editor", value: "editor" },
];
