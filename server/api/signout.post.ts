import { supabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const { sessionId } = await readBody(event);
  await supabase.from("sessions").delete().eq("session_id", sessionId);
  return;
});
