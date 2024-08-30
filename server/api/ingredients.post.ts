import { supabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = query.userId;
  const ingredient = query.ingredient;
  const quantity = query.quantity;
  const unit = query.unit;

  try {
    await supabase.from("ingredients").insert({
      user_id: userId,
      ingredient: ingredient,
      quantity: quantity,
      unit: unit,
    });

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
