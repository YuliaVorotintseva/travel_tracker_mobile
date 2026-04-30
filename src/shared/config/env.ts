const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON;

type EnvShape = {
  SUPABASE_URL: string;
  SUPABASE_ANON: string;
};

export const ENV: EnvShape = {
  SUPABASE_URL: supabaseUrl || "https://wtvoqcpxqsgmqfimwpbl.supabase.co",
  SUPABASE_ANON:
    supabaseAnon ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0dm9xY3B4cXNnbXFmaW13cGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MjUxODcsImV4cCI6MjA5MzEwMTE4N30.3JLEVv3qWbOli3dm6iwb2LMMA36A4zVPXxwyfSymW_o",
};
