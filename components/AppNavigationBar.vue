<template>
  <aside v-if="isDesktop">
    <UVerticalNavigation
      :links="links"
      :ui="{
        wrapper: 'min-w-52 min-h-full px-3 py-4',
        base: 'mb-2',
        size: 'text-base',
        padding: 'p-2',
      }"
    />
  </aside>

  <div v-if="isMobileOrTablet">
    <header class="flex h-16 w-full items-center justify-end px-2">
      <UButton
        color="white"
        size="lg"
        icon="heroicons:bars-3-bottom-right-20-solid"
        class="m-2"
        :ui="{
          base: 'w-10 h-10',
        }"
        @click="isOpen = true"
      />
    </header>
    <USlideover v-model="isOpen">
      <div class="flex-1 p-4">
        <UButton
          color="white"
          size="lg"
          icon="i-heroicons-x-mark-20-solid"
          class="absolute end-5 top-5 z-10 flex"
          @click="isOpen = false"
        />
        <UVerticalNavigation
          :links="links"
          :ui="{
            wrapper: 'min-w-52 min-h-full px-3 py-16',
            base: 'mb-2',
            size: 'text-base',
            padding: 'p-5',
          }"
        />
      </div>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
const { isDesktop, isMobileOrTablet } = useDevice();
const isOpen = ref(false);
const isLoggedIn = ref(false);
const { sessionCookie } = useSession();

const signOut = async () => {
  await $fetch("/api/signout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId: sessionCookie.value,
    }),
  });

  sessionCookie.value = null;
  isOpen.value = false;

  return navigateTo("/signin");
};

const links = ref([
  [
    {
      label: "食材リスト",
      to: "/",
      click: isMobileOrTablet
        ? () => {
            isOpen.value = false;
          }
        : undefined,
    },
    {
      label: "レシピ",
      to: "/recipe",
      click: isMobileOrTablet
        ? () => {
            isOpen.value = false;
          }
        : undefined,
    },
    {
      label: "Settings",
      to: "/settings",
      click: isMobileOrTablet
        ? () => {
            isOpen.value = false;
          }
        : undefined,
    },
  ],
]);

watch(
  sessionCookie,
  () => {
    isLoggedIn.value = !isLoggedIn.value;

    if (isLoggedIn.value) {
      links.value.push([
        {
          label: "ログアウト",
          icon: "i-heroicons-arrow-left-start-on-rectangle",
          click: signOut,
        },
      ]);
    }
    if (!isLoggedIn.value) {
      links.value.pop();
    }
  },
  { immediate: true },
);
</script>
