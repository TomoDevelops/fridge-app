import { supabase } from "~/server/utils/supabase";
import { getUserId } from "../utils/getUserId";

export default defineEventHandler(async (event) => {
  const cookie = parseCookies(event);
  const userId = await getUserId(cookie);
  const query = getQuery(event);
  const ingredientsToDelete = Array.isArray(query.ingredientsToDelete)
    ? query.ingredientsToDelete
    : [query.ingredientsToDelete];

  try {
    await supabase
      .from("ingredients")
      .delete()
      .in("ingredient_id", ingredientsToDelete)
      .eq("user_id", userId);

    setResponseStatus(event, 200);
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw createError({
        statusCode: 400,
        statusMessage: err.message,
      });
    }
  }
});
