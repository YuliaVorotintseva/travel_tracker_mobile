const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON;
const webClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const androidClientId = process.env.EXPO_PUBLIC_ANDROID_CLIEND_ID;
const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

type EnvShape = {
  SUPABASE_URL: string;
  SUPABASE_ANON: string;
  WEB_CLIENT_ID: string;
  ANDROID_CLIENT_ID: string;
  IOS_CLIENT_ID: string;
};

export const ENV: EnvShape = {
  SUPABASE_URL: supabaseUrl || "https://wtvoqcpxqsgmqfimwpbl.supabase.co",
  SUPABASE_ANON:
    supabaseAnon ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0dm9xY3B4cXNnbXFmaW13cGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MjUxODcsImV4cCI6MjA5MzEwMTE4N30.3JLEVv3qWbOli3dm6iwb2LMMA36A4zVPXxwyfSymW_o",
  WEB_CLIENT_ID:
    webClientId ||
    "166459366038-fbetjvo5rpv7gf255kpi1rmp1g28klkq.apps.googleusercontent.com",
  ANDROID_CLIENT_ID:
    androidClientId ||
    "166459366038-67kvgp40ru1r3d60hf2hhh2uupvo2bpl.apps.googleusercontent.com",
  IOS_CLIENT_ID:
    iosClientId ||
    "166459366038-mqigb285j43lvm4c4v42ktiptj50702m.apps.googleusercontent.com",
};
