import { supabase } from "~/server/utils/supabase";
import { getUserId } from "../utils/getUserId";

export default defineEventHandler(async (event) => {
  const cookie = parseCookies(event);
  const userId = await getUserId(cookie);
  const query = getQuery(event);
  const recipeId = query.recipeId as number;

  try {
    await supabase
      .from("recipes")
      .delete()
      .eq("user_id", userId)
      .eq("recipe_id", recipeId);
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
