import { createClient } from "@supabase/supabase-js";

export const useSupabase = () => {
  const runtimeConfig = useRuntimeConfig();
  const supabase = createClient(
    runtimeConfig.supabaseUrl,
    runtimeConfig.supabaseKey,
  );

  return { supabase };
};
