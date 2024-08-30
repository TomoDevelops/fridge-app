import { supabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = query.userId;

  try {
    const ingredients = await supabase
      .from("ingredients")
      .select("ingredientId:ingredient_id,ingredient,quantity,unit")
      .eq("user_id", userId);

    return {
      ingredients: ingredients.data as Ingredient[],
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw createError({
        statusCode: 400,
        statusMessage: err.message,
      });
    }
  }
});
