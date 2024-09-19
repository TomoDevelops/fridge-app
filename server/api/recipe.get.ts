import { supabase } from "~/server/utils/supabase";
import { openai } from "../utils/openai";

import { getUserId } from "../utils/getUserId";

export default defineEventHandler(async (event) => {
  const cookie = parseCookies(event);
  const userId = await getUserId(cookie);
  const query = getQuery(event);
  const fetchNewRecipes = query.fetchNewRecipes === "true";

  let recipes: Recipe[] = [];

  recipes = await getRecipes(userId);

  const ingredients = await getIngredients(userId);

  if (ingredients.length === 0) {
    return { recipes: [], noIngredients: true };
  }

  if (recipes.length === 0 || fetchNewRecipes) {
    const generatedRecipes = await generateRecipes(ingredients, recipes);
    await saveRecipes(userId, generatedRecipes);
    recipes.push(...generatedRecipes);
  }

  return { recipes, noIngredients: false };
});

const getIngredients = async (userId: number): Promise<Ingredient[]> => {
  const ingredients = await supabase
    .from("ingredients")
    .select("ingredient,quantity,unit")
    .eq("user_id", userId);

  return ingredients.data as Ingredient[];
};

const getRecipes = async (userId: number): Promise<Recipe[]> => {
  const recipes = await supabase
    .from("recipes")
    .select("recipeId:recipe_id,recipeName:recipe_name,ingredients,method")
    .eq("user_id", userId);

  return recipes.data as Recipe[];
};

const generateRecipes = async (
  ingredients: Ingredient[],
  recipes: Recipe[],
) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
              あなたは一流の栄養士兼シェフです。
              日本語も流ちょうに話せます。
              以下の材料を使って3つ料理を提案してください。
              ${recipes.length > 0 ? `これらの料理は最近食べたので、別のもので作成してください: ${recipes.map((recipe) => recipe.recipeName).join(", ")}` : ""}
              記載の材料以外は使わないでください。
              調味料に関しては一般家庭にあるものの使用を許可します。
              各料理は次のJavaScriptアプリケーションで処理可能なJSONフォーマットで出力してください:
              [{
                  "recipeName": "トマトとひき肉のスープ",
                  "ingredients": ["ひき肉 100g", "トマト 3個", "レタス 1玉"],
                  "method": [
                      "トマトを1cm角に切ります。",
                      "レタスを洗って一口大にちぎります。",
                      "鍋に油を熱し、ひき肉を炒めます。",
                      "ひき肉に火が通ったらトマトを加え、一緒に炒めます。",
                      "鍋に水を加え、沸騰させます。",
                      "レタスを加え、サッと煮立てます。",
                      "塩コショウで味を整えたら完成です。"
                  ]
              },]
              各料理には材料の切り方や各手順の準備の仕方等の具体的な手順をレシピ形式で記載してください。
              すべての材料を使う必要はありません。
              簡潔かつ具体的に答えてください。
              No yapping.
            `,
      },
      {
        role: "user",
        content: `現在の材料:\n${ingredients.map((ingredient) => `${ingredient.ingredient}が${ingredient.quantity}${ingredient.unit}`).join("\n")}`,
      },
    ],
  });

  const res = completion.choices[0].message.content
    ?.replace(/^```json/, "")
    .replace(/```$/, "");

  if (res === undefined) throw new Error("レシピの生成に失敗しました。");
  try {
    const parsedRecipes = JSON.parse(res);
    return parsedRecipes;
  } catch (err) {
    throw new Error("レシピの生成に失敗しました。");
  }
};

const saveRecipes = async (userId: number, recipes: Recipe[]) => {
  for (const recipe of recipes) {
    await supabase.from("recipes").insert({
      user_id: userId,
      recipe_name: recipe.recipeName,
      ingredients: recipe.ingredients,
      method: recipe.method,
    });
  }
};
