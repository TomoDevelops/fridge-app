<template>
  <div>
    <div>
      <UTable
        v-model="selectedIngredient"
        :rows="ingredients"
        :columns="tableColumns"
        @select="select"
      >
        <template #empty-state>
          <div class="flex flex-col items-center justify-center gap-3 py-6">
            <span class="text-sm italic">食材リストが空です。</span>
            <UButton label="食材を追加する" @click="isOpen = true" />
          </div>
        </template>
      </UTable>
      <div class="flex px-3 py-3.5 dark:border-gray-700">
        <UButton
          v-if="selectedIngredient.length > 0"
          label="削除する"
          icon="i-heroicons-trash-solid"
          color="red"
          trailing
          :ui="{
            padding: {
              sm: 'px-4 py-1.5',
            },
          }"
          @click="onDelete"
        />
      </div>
    </div>
    <Modal
      :is-open="isOpen"
      modal-button-text="食材を保存する"
      @close-modal="isOpen = false"
      @submit="onSubmit"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="mx-4 space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="食材" name="ingredient" required>
          <UInput v-model="state.ingredient" placeholder="レタス" />
        </UFormGroup>

        <div class="flex gap-3">
          <UFormGroup label="分量" name="quantity" required>
            <UInput v-model="state.quantity" placeholder="1" />
          </UFormGroup>
          <UFormGroup label="単位" name="unit" required>
            <UInput v-model="state.unit" placeholder="玉" />
          </UFormGroup>
        </div>
      </UForm>
    </Modal>
    <button
      class="bg-primary fixed bottom-4 right-4 grid h-16 w-16 place-items-center rounded-full"
      @click="isOpen = true"
    >
      <UIcon name="i-heroicons-plus" class="h-10 w-10" />
    </button>
  </div>
</template>

<script setup lang="ts">
// Components
import Modal from "~/components/shared/Modal.vue";
// Composables
import { useIngredients } from "~/composables/useIngredients";
// Third-Party
import { z } from "zod";

const isOpen = ref(false);
const ingredients = ref<Ingredient[] | undefined>(await useIngredients());
const selectedIngredient = ref<Ingredient[]>([]);

const tableColumns = [
  { key: "ingredient", label: "食材" },
  { key: "quantity", label: "分量" },
  { key: "unit", label: "単位" },
];

const schema = z.object({
  ingredient: z.string().min(1, "食材を入力してください"),
  unit: z.string().min(1, "食材の単位を入力してください"),
  quantity: z.string().min(1, "分量を入力してください。"),
});

const state = reactive({
  ingredient: undefined,
  unit: undefined,
  quantity: undefined,
});

const onSubmit = async () => {
  const data = await $fetch("/api/ingredients", {
    method: "POST",
    query: {
      ingredient: state.ingredient,
      quantity: state.quantity,
      unit: state.unit,
    },
  });

  if (data?.ingredients === null || data?.ingredients === undefined) {
    return;
  }

  ingredients.value = JSON.parse(JSON.stringify(data.ingredients));

  Object.assign(state, {
    ingredient: undefined,
    unit: undefined,
    quantity: undefined,
  });

  isOpen.value = false;
};

const onDelete = async () => {
  const ingredientsToDelete = selectedIngredient.value.map(
    (ingredient) => ingredient.ingredientId,
  );

  await $fetch("/api/ingredients", {
    method: "DELETE",
    query: {
      ingredientsToDelete: ingredientsToDelete,
    },
  });

  selectedIngredient.value = [];
  ingredients.value = await useIngredients();
};

const select = (row: Ingredient) => {
  const index = selectedIngredient.value.findIndex(
    (item: Ingredient) => item.ingredientId === row.ingredientId,
  );
  if (index === -1) {
    selectedIngredient.value.push(row);
  } else {
    selectedIngredient.value.splice(index, 1);
  }
};
</script>
