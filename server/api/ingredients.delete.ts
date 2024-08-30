import { supabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = query.userId;
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
