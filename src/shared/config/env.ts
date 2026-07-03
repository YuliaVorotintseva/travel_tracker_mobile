const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON;
const webClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const androidClientId = process.env.EXPO_PUBLIC_ANDROID_CLIEND_ID;
const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;
const googleMapsKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY;

type EnvShape = {
  SUPABASE_URL: string;
  SUPABASE_ANON: string;
  WEB_CLIENT_ID: string;
  ANDROID_CLIENT_ID: string;
  IOS_CLIENT_ID: string;
  GOOGLE_MAPS_KEY: string;
};

export const ENV: EnvShape = {
  SUPABASE_URL: supabaseUrl || "",
  SUPABASE_ANON: supabaseAnon || "",
  WEB_CLIENT_ID: webClientId || "",
  ANDROID_CLIENT_ID: androidClientId || "",
  IOS_CLIENT_ID: iosClientId || "",
  GOOGLE_MAPS_KEY: googleMapsKey || "",
};
