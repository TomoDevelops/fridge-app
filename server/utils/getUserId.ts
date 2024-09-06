import { supabase } from "~/server/utils/supabase";

export const getUserId = async (cookie: Record<string, string>) => {
  const sessionId = cookie.session;
  const userId = await fetchUserId(sessionId);
  return userId;
};

const fetchUserId = async (sessionId: string) => {
  const session = await supabase
    .from("sessions")
    .select("user_id")
    .eq("session_id", sessionId)
    .single();

  return session.data?.user_id;
};
