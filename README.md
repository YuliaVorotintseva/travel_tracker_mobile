# Travel Tracker Mobile

## Collaborative trip planner with automatic background sync and seamless cross-platform UX.

[![React Native](https://img.shields.io/badge/React_Native-05122A?style=flat&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=react-query&logoColor=white)](https://tanstack.com/query/latest)

## Key Features

- **Smart Itinerary Builder** – Drag-and-drop activities, automatic route sorting, address geocoding
- **Offline Support** – Optimistic UI, mutation queue, automatic background sync on reconnect
- **Real-Time Collaboration** – Live updates for activities, comments, and member roles via Supabase Channels
- **Role-Based Access** – `Owner` / `Editor` / `Viewer` permissions with secure RLS policies
- **System Theme Sync** – Automatic light/dark adaptation with persistent user preference
- **Deep Linking Invites** – One-tap trip joining via secure UUID-based invite links

## 🛠 Tech Stack

| Category         | Technologies                                                              |
| ---------------- | ------------------------------------------------------------------------- |
| **Frontend**     | React Native, Expo SDK 54, TypeScript, Expo Router, FlashList, Reanimated |
| **State & Data** | TanStack Query v5, Zustand, `@tanstack/query-async-storage-persister`     |
| **Backend**      | Supabase (PostgreSQL, RLS, Realtime, Auth, Edge Functions)                |
| **Native APIs**  | NetInfo, Expo Location, Deep Linking, Clipboard, System UI                |
| **Tooling**      | ESLint, Prettier, Metro                                                   |

## 🏗 Architecture & Engineering Decisions

### Offline-First Data Layer

- Built a **custom mutation queue** (`offlineQueue.ts`) that intercepts failed requests, stores them in AsyncStorage, and replays them on network restore.
- Wrapped React Query mutations in `useOfflineMutation<T>` for **type-safe optimistic updates** with automatic rollback on failure.
- Used `createAsyncStoragePersister` to cache query results across app restarts, ensuring instant UI hydration.

### Real-Time Conflict Resolution

- Solved React Strict Mode + Supabase channel caching conflicts by generating **unique channel names** per mount and explicitly calling `supabase.removeChannel()` in cleanup.
- Implemented **debounced invalidation** to prevent query spam during rapid drag-and-drop operations.

### Security & Type Safety

- Strict RLS policies on all tables (`activities`, `expenses`, `trip_members`, `comments`) scoped to `auth.uid()` and `trip_id`.
- End-to-end TypeScript with **Zod runtime validation** for API payloads and form inputs.
- Supabase client generated with `supabase gen types typescript` for zero-drift schema sync.

## Screenshots

<table>
  <tr>
    <td align="center">
      <img src="assets/screenshorts/login.jpg" alt="Login (light)" width="200"/><br/>
      <sub>Login (light)</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/register.jpg" alt="Register (light)" width="200"/><br/>
      <sub>Register (light)</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/my-location-light.jpg" alt="Home (light)" width="200"/><br/>
      <sub>Home (light)</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="assets/screenshorts/my-location-dark.jpg" alt="Home (dark)" width="200"/><br/>
      <sub>Home (dark)</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/menu-light.jpg" alt="Menu (light)" width="200"/><br/>
      <sub>Menu (light)</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/menu-dark.jpg" alt="Menu (dark)" width="200"/><br/>
      <sub>Menu (dark)</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="assets/screenshorts/profile.jpg" alt="Profile" width="200"/><br/>
      <sub>Profile</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/trips-light.jpg" alt="Trips (light)" width="200"/><br/>
      <sub>Trips (light)</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/trips-dark.jpg" alt="Trips (dark)" width="200"/><br/>
      <sub>Trips (dark)</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="assets/screenshorts/edit-trip.jpg" alt="Edit trip" width="200"/><br/>
      <sub>Edit trip</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/edit-trip-members.jpg" alt="Members" width="200"/><br/>
      <sub>Members</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/edit-trip-currency-dark.jpg" alt="Currency (dark)" width="200"/><br/>
      <sub>Currency (dark)</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="assets/screenshorts/trip-map-light-without-group.jpg" alt="Map (no group)" width="200"/><br/>
      <sub>Map (no group)</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/trip-map-light.jpg" alt="Map (with group)" width="200"/><br/>
      <sub>Map (with group)</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/trip-map-light-without-route.jpg" alt="Map (no route)" width="200"/><br/>
      <sub>Map (no route)</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="assets/screenshorts/trip-map-dark.jpg" alt="Map (dark)" width="200"/><br/>
      <sub>Map (dark)</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/route-builder-light.jpg" alt="Route builder (light)" width="200"/><br/>
      <sub>Route builder (light)</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/route-builder-dark.jpg" alt="Route builder (dark)" width="200"/><br/>
      <sub>Route builder (dark)</sub>
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <img src="assets/screenshorts/activities-light.jpg" alt="Activities (light)" width="200"/><br/>
      <sub>Activities (light)</sub>
    </td>
    <td align="center">
      <img src="assets/screenshorts/activities-and-comments-dark.jpg" alt="Activities (dark)" width="200"/><br/>
      <sub>Activities (dark)</sub>
    </td>
  </tr>
</table>

## Setup & Installation

1. Clone

```bash
git clone https://github.com/yourusername/traveltracker.git
cd traveltracker
npm install
```

2. Install dependencies:

```bash
yarn install
```

3. Enviroment setup

```bash
cp .env.example .env.local # Fill in Supabase URL/Anon Key, API secrets, and map keys
```

4. DB setup

- Run SQL migrations in Supabase SQL Editor (tables, indexes, RLS policies, RPC functions)
- Enable Realtime for activities, trip_members, activity_comments, expenses

```bash
yarn db:start # Local DB start
```

5. Generate api:

```bash
yarn openapi
```

6. Prebuild native-projects:

```bash
yarn prebuild
```

7. Local build for Android:

```bash
yarn android
```

8. Local build for IOS:

```bash
yarn ios
```

## Author

**Yulia Vorotintseva**

- **GitHub**: @YuliaVorotintseva
- **Email**: yulia.vorotintseva@gmail.com
