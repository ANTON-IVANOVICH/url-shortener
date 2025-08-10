<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/utils/api";

const route = useRoute();
const shortUrl = ref(route.params.shortUrl as string);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const response = await api.get(`/${shortUrl.value}`);

    if (response.status === 302 && response.headers.location) {
      window.location.href = response.headers.location;
    }
  } catch (err: any) {
    if (err.status === 404) {
      error.value = "URL not found";
    } else if (err.status === 410) {
      error.value = "URL has expired";
    } else {
      error.value = "An error occurred";
      console.error("Redirect failed:", err);
    }
  }
});
</script>

<template>
  <div class="redirect">
    <h1>Redirecting...</h1>
    <p v-if="!error">Please wait while we redirect you to the target URL.</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.redirect {
  text-align: center;
  padding: 40px;
}

.error {
  color: #dc3545;
  font-weight: bold;
}
</style>
