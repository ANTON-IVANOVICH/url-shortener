<script setup lang="ts">
import { ref } from "vue";
import { useUrlStore } from "@/stores/urlStore";
import { useRouter } from "vue-router";

const urlStore = useUrlStore();
const router = useRouter();

const originalUrl = ref("");
const alias = ref("");
const expiresAt = ref("");
const successMessage = ref("");

const submitForm = async () => {
  successMessage.value = "";

  const payload = {
    originalUrl: originalUrl.value,
    alias: alias.value || undefined,
    expiresAt: expiresAt.value
      ? new Date(expiresAt.value).toISOString()
      : undefined,
  };

  try {
    const newUrl = await urlStore.createUrl(payload);
    successMessage.value = newUrl.shortUrl;

    router.push({ name: "url-info", params: { shortUrl: newUrl.shortUrl } });

    originalUrl.value = "";
    alias.value = "";
    expiresAt.value = "";
  } catch (error) {}
};
</script>

<template>
  <form @submit.prevent="submitForm" class="url-form">
    <div class="form-group">
      <label for="originalUrl">Original URL *</label>
      <input
        type="url"
        id="originalUrl"
        v-model="originalUrl"
        required
        placeholder="https://example.com"
        class="form-input"
      />
    </div>

    <div class="form-group">
      <label for="alias">Custom Alias (optional, max 20 chars)</label>
      <input
        type="text"
        id="alias"
        v-model="alias"
        maxlength="20"
        placeholder="my-custom-alias"
        class="form-input"
      />
    </div>

    <div class="form-group">
      <label for="expiresAt">Expiration Date (optional)</label>
      <input
        type="datetime-local"
        id="expiresAt"
        v-model="expiresAt"
        class="form-input"
      />
    </div>

    <div v-if="urlStore.loading" class="loading-indicator">
      Creating short URL...
    </div>

    <button type="submit" :disabled="urlStore.loading" class="submit-btn">
      {{ urlStore.loading ? "Creating..." : "Shorten URL" }}
    </button>

    <div v-if="urlStore.error" class="error-message">
      {{ urlStore.error }}
    </div>
  </form>
</template>

<style scoped>
.url-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.submit-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  width: 100%;
  transition: background-color 0.3s;
}

.submit-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

.loading-indicator {
  margin: 10px 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  text-align: center;
}
</style>
