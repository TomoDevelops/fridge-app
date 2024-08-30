import { supabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = query.id;
  const { data } = await supabase
    .from("users")
    .select("userId:user_id,emailAddress:email_address")
    .eq("user_id", userId);

  return {
    users: data,
  };
});
