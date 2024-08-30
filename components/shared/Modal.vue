<template>
  <UModal
    :model-value="props.isOpen"
    :ui="{ container: 'items-center rounded-lg' }"
  >
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800 rounded-lg',
        body: {
          base: 'grow py-10',
        },
        footer: {
          base: 'flex justify-end',
        },
      }"
    >
      <template #header>
        <div class="flex items-center justify-end">
          <UButton
            color="white"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="modalClose"
          />
        </div>
      </template>
      <slot />
      <template #footer>
        <UButton
          type="submit"
          size="lg"
          :ui="{
            padding: {
              lg: 'px-10 py-2',
            },
          }"
          @click="submit"
        >
          {{ props.modalButtonText }}
        </UButton>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
interface ModalProps {
  isOpen: boolean;
  modalButtonText: string;
}

const props = defineProps<ModalProps>();

const emit = defineEmits(["closeModal", "submit"]);

const modalClose = () => {
  emit("closeModal");
};
const submit = () => {
  emit("submit");
};
</script>
