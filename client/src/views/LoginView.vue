<template>
  <!-- <form @submit.prevent="onSubmit">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Login</button>
  </form> -->
  <div class="card flex justify-center">
    <Form @submit="onSubmit" class="flex flex-col gap-4 w-full sm:w-64">
      <div class="flex flex-col gap-1">
        <InputText type="text" v-model="email" placeholder="Email" />
        <Password
          v-model="password"
          name="password"
          placeholder="Password"
          :feedback="false"
          fluid
        />
      </div>
      <Button type="submit" severity="secondary" label="Submit" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { login } from "../services/authService";

const email = ref("");
const password = ref("");
const router = useRouter();
const route = useRoute();

async function onSubmit() {
  try {
    await login(email.value, password.value);
    const redirect = (route.query.redirect as string) || "/";
    router.push(redirect);
  } catch (err) {
    alert("Login failed");
  }
}
</script>
