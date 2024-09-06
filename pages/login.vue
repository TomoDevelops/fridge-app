<template>
  <div>
    <div>Login</div>
  </div>
</template>

<script setup lang="ts">
const { sessionCookie } = useAuth();

const onSignIn = async () => {
  sessionCookie.value = null;
};
</script>
