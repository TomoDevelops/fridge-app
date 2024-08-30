export const useIngredients = async (userId: number) => {
  const { data } = await useFetch("/api/ingredients", {
    query: {
      userId,
    },
  });

  const fetchedIngredients = data.value?.ingredients;

  return fetchedIngredients;
};
