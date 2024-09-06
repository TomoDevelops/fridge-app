export const useIngredients = async () => {
  const { data } = await useFetch("/api/ingredients");

  const fetchedIngredients = data.value?.ingredients;

  return fetchedIngredients;
};
