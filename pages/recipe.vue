<template>
  <div>
    <div
      v-if="hasNoIngredients"
      class="flex flex-col items-center justify-center gap-3 py-6"
    >
      <span class="text-sm italic">食材リストが空です。</span>
      <UButton to="/">食材を追加してください</UButton>
    </div>

    <div
      v-if="!recipes?.length && !hasNoIngredients"
      class="flex flex-col items-center justify-center gap-3 py-6"
    >
      <span class="text-sm italic">レシピを新しく生成する必要があります。</span>
      <UButton @click="generateRecipe">レシピを生成</UButton>
    </div>

    <template v-else>
      <div class="mt-4 flex flex-col gap-4">
        <UCard
          v-for="recipe in recipes"
          :key="recipe.recipeName"
          :ui="{
            body: {
              base: 'flex items-center justify-between',
            },
          }"
          @click="openRecipeModal(recipe)"
        >
          <div>
            <h2 class="text-base font-bold">{{ recipe.recipeName }}</h2>
            <p class="mt-1 text-xs">
              食材: {{ recipe.ingredients.join(", ") }}
            </p>
          </div>
          <UIcon name="i-heroicons-chevron-double-right" class="h-6 w-6" />
        </UCard>
      </div>
      <Modal
        fullscreen
        :is-open="isOpen"
        :header-title="selectedRecipe?.recipeName"
        modal-button-text="レシピを削除する"
        @close-modal="isOpen = false"
        @submit="deleteRecipe"
      >
        <h4
          class="text-primary decoration-primary mb-4 underline decoration-wavy underline-offset-8"
        >
          食材
        </h4>
        <ul class="px-4">
          <li
            v-for="ingredient in selectedRecipe?.ingredients"
            :key="ingredient"
            class="mb-3 list-disc text-sm"
          >
            {{ ingredient }}
          </li>
        </ul>
        <br />
        <h4
          class="text-primary decoration-primary mb-4 underline decoration-wavy underline-offset-8"
        >
          調理手順
        </h4>
        <ol class="px-4">
          <li
            v-for="ingredient in selectedRecipe?.method"
            :key="ingredient"
            class="mb-3 list-decimal text-sm"
          >
            {{ ingredient }}
          </li>
        </ol>
      </Modal>
      <button
        class="bg-primary fixed bottom-4 right-4 grid h-16 w-16 place-items-center rounded-full"
        @click="generateRecipe"
      >
        <UIcon name="i-arcticons-recipe-keeper" class="h-10 w-10" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
// Components
import Modal from "~/components/shared/Modal.vue";

const { fetchedRecipe, noIngredients } = await useRecipe();
const recipes = ref<Recipe[] | undefined>(fetchedRecipe);
const hasNoIngredients = ref<boolean | undefined>(noIngredients);
const selectedRecipe = ref<Recipe>();
const isOpen = ref(false);

const openRecipeModal = (data: Recipe) => {
  selectedRecipe.value = data;
  isOpen.value = true;
};

const deleteRecipe = async () => {
  await $fetch("/api/recipe", {
    method: "DELETE",
    query: {
      recipeId: selectedRecipe.value?.recipeId,
    },
  });

  isOpen.value = false;
  const { fetchedRecipe } = await useRecipe();
  recipes.value = fetchedRecipe;
};

const generateRecipe = async () => {
  const { fetchedRecipe } = await useRecipe(true);
  recipes.value = fetchedRecipe;
};
</script>
