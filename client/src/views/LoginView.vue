<template>
  <div class="card flex justify-center">
    <Form @submit="onSubmit" class="flex flex-col gap-4 w-full sm:w-64">
      <div class="flex flex-col gap-1">
        <InputText type="text" v-model="email" placeholder="Email" />
        <Password
          v-model="password"
          name="password"
          placeholder="Password"
          :feedback="false"
        />
      </div>
      <Button type="submit" severity="secondary" label="Submit" />
    </Form>
  </div>
  <Toast position="bottom-right" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { login } from "../services/authService";
import { Button, InputText, Password } from "primevue";
import { Form } from "@primevue/forms";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

const email = ref("");
const password = ref("");

const router = useRouter();
const route = useRoute();
const toast = useToast();

async function onSubmit() {
  try {
    await login(email.value, password.value);
    const redirect = (route.query.redirect as string) || "/";
    router.push(redirect);
  } catch (err) {
    toast.add({
      summary: "Error",
      detail: (err as Error).message,
      severity: "error",
      life: 3000,
    });
  }
}
</script>

<style scoped></style>
