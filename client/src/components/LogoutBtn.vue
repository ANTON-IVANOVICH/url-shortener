<template>
  <button @click="onLogout">Logout</button>
</template>

<script setup lang="ts">
import { logout } from "../services/authService";
import { useRouter } from "vue-router";

const router = useRouter();
async function onLogout() {
  await logout();
  router.push("/login");
}
</script>
