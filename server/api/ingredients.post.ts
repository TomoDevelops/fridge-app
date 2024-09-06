import { supabase } from "~/server/utils/supabase";
import { getUserId } from "../utils/getUserId";

export default defineEventHandler(async (event) => {
  const cookie = parseCookies(event);
  const userId = await getUserId(cookie);
  const query = getQuery(event);
  const ingredient = query.ingredient as string;
  const quantity = query.quantity as number;
  const unit = query.unit as string;

  try {
    const ingredients = await saveIngredient(
      userId,
      ingredient,
      quantity,
      unit,
    );

    return {
      ingredients,
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

const saveIngredient = async (
  userId: number,
  ingredient: string,
  quantity: number,
  unit: string,
) => {
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

  return ingredients.data;
};
