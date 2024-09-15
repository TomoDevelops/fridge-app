export const useRecipe = async () => {
  const { data } = await useFetch("/api/recipe");

  const fetchedRecipe = data.value?.recipe;

  return fetchedRecipe;
};
