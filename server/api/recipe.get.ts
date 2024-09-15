import { supabase } from "~/server/utils/supabase";
import { openai } from "../utils/openai";

import { getUserId } from "../utils/getUserId";

export default defineEventHandler(async (event) => {
  const cookie = parseCookies(event);
  const userId = await getUserId(cookie);

  // const ingredients = await getIngredients(userId);

  // if (ingredients) {
  //   console.log(ingredients);
  // }

  //   const testIngredients = [
  //     { ingredient: "チーズ", quantity: 1, unit: "枚" },
  //     { ingredient: "ひき肉", quantity: 200, unit: "g" },
  //     { ingredient: "トマト", quantity: 5, unit: "個" },
  //     { ingredient: "レタス", quantity: 2, unit: "玉" },
  //     { ingredient: "キャベツ", quantity: 1, unit: "玉" },
  //     { ingredient: "納豆", quantity: 2, unit: "パック" },
  //     { ingredient: "犬", quantity: 2, unit: "匹" },
  //   ];

  //   const completion = await openai.chat.completions.create({
  //     model: "gpt-4o-mini",
  //     messages: [
  //       {
  //         role: "system",
  //         content: `
  //             あなたは一流の栄養士兼シェフです。
  //             日本語も流ちょうに話せます。
  //             以下の材料を使って3つ料理を提案してください。
  //             記載の材料以外は使わないでください。
  //             調味料に関しては一般家庭にあるものの使用を許可します。
  //             各料理は次のJavaScriptアプリケーションで処理可能なJSONフォーマットで出力してください:
  //             [{
  //                 "recipeName": "料理名",
  //                 "ingredients": ["材料1 個数単位", "材料2 個数単位", ...],
  //                 "method": [
  //                     "手順1",
  //                     "手順2",
  //                     ...
  //                 ]
  //             }, ...]
  //             各料理には材料の切り方や各手順の準備の仕方等の具体的な手順をレシピ形式で記載してください。
  //             すべての材料を使う必要はありません。
  //             簡潔かつ具体的に答えてください。
  //             例:
  //             [{
  //                 "recipeName": "トマトとひき肉のスープ",
  //                 "ingredients": ["ひき肉 100g", "トマト 3個", "レタス 1玉"],
  //                 "method": [
  //                     "トマトを1cm角に切ります。",
  //                     "レタスを洗って一口大にちぎります。",
  //                     "鍋に油を熱し、ひき肉を炒めます。",
  //                     "ひき肉に火が通ったらトマトを加え、一緒に炒めます。",
  //                     "鍋に水を加え、沸騰させます。",
  //                     "レタスを加え、サッと煮立てます。",
  //                     "塩コショウで味を整えたら完成です。"
  //                 ]
  //             },]
  //           `,
  //       },
  //       {
  //         role: "user",
  //         content: `現在の材料:\n${ingredients.map((ingredient) => `${ingredient.ingredient}が${ingredient.quantity}${ingredient.unit}`).join("\n")}`,
  //       },
  //     ],
  //   });

  //   const response = completion.choices[0].message.content
  //     ?.replace(/^```json/, "")
  //     .replace(/```$/, "");

  //   return response;
  const recipe = [
    {
      recipeName: "トマトとひき肉のグラタン",
      ingredients: ["ひき肉 200g", "トマト 2個", "チーズ 1枚"],
      method: [
        "トマトを半分に切り、種を取り除いて1cm角に切ります。",
        "フライパンにひき肉を加え、中火で炒めます。ひき肉に火が通ったら、切ったトマトを加えます。",
        "材料が混ざったら、塩とコショウで味を整えます。",
        "耐熱皿にひき肉とトマトの混ぜたものを盛り、上にチーズをのせます。",
        "オーブンに入れ、180℃で10分焼いてチーズが溶けたら完成です。",
      ],
    },
    {
      recipeName: "レタスと納豆のサラダ",
      ingredients: ["レタス 1玉", "納豆 2パック", "トマト 1個"],
      method: [
        "レタスは洗って食べやすい大きさにちぎります。",
        "トマトは薄切りにします。",
        "ボウルにレタス、納豆、トマトを入れ、軽く混ぜます。",
        "お好みで塩やコショウを加えて味を整えれば完成です。",
      ],
    },
    {
      recipeName: "キャベツとひき肉の炒め物",
      ingredients: ["キャベツ 1玉", "ひき肉 200g", "トマト 2個"],
      method: [
        "キャベツは一口大に切ります。",
        "トマトは1cm角に切ります。",
        "フライパンに油を熱し、ひき肉を加えて炒めます。",
        "ひき肉に火が通ったら、キャベツを加え、しんなりするまで炒めます。",
        "最後にトマトを加え、全体を軽く混ぜて好みの味付けをします。",
        "器に盛り付けて完成です。",
      ],
    },
  ];

  return { recipe };
});

const getIngredients = async (userId: number): Promise<Ingredient[]> => {
  const ingredients = await supabase
    .from("ingredients")
    .select("ingredient,quantity,unit")
    .eq("user_id", userId);

  return ingredients.data as Ingredient[];
};
