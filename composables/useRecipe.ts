export const useRecipe = async (fetchNewRecipes: boolean = false) => {
  const { data } = await useFetch("/api/recipe", {
    query: {
      fetchNewRecipes,
    },
  });

  const fetchedRecipe = data.value?.recipes;
  const noIngredients = data.value?.noIngredients;

  return { fetchedRecipe, noIngredients };
};
