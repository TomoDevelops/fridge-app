<template>
  <div class="p-4">
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UAlert
        v-if="authError"
        color="red"
        variant="solid"
        description="アカウント登録に失敗しました。"
      />
      <UFormGroup label="メールアドレス" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="パスワード" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton type="submit"> 登録する </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { sessionCookie } = useSession();
const authError = ref(false);

const schema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください。"),
  password: z.string().min(8, "パスワードは8文字以上で入力してください。"),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = await $fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: event.data.email,
      password: event.data.password,
    }),
  });

  if (data.status === 401) {
    authError.value = true;
    return;
  }

  sessionCookie.value = data.sessionId;
  return navigateTo("/");
}
</script>
