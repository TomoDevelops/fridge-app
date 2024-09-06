import { supabase } from "~/server/utils/supabase";
import { getUserId } from "../utils/getUserId";

export default defineEventHandler(async (event) => {
  const cookie = parseCookies(event);
  const userId = await getUserId(cookie);

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
