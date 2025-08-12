<template>
  <div>
    <h2>Создать короткую ссылку</h2>
    <form @submit.prevent="onSubmit">
      <input
        v-model="originalUrl"
        type="url"
        placeholder="Оригинальный URL"
        required
      />
      <input
        v-model="alias"
        type="text"
        maxlength="20"
        placeholder="Alias (опционально)"
      />
      <input
        v-model="expiresAt"
        type="datetime-local"
        placeholder="Expires At"
      />
      <button type="submit" :disabled="loading">Создать</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <div v-if="shortUrl">
      Короткая ссылка:
      <router-link :to="`/${shortUrl}`">{{ shortUrl }}</router-link>
      <button @click="onDelete" :disabled="loading">Удалить</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useUrlStore } from "../stores/urlStore";

export default defineComponent({
  setup() {
    const store = useUrlStore();
    const originalUrl = ref("");
    const alias = ref<string | undefined>();
    const expiresAt = ref<string | undefined>();

    const onSubmit = () =>
      store.createUrl(originalUrl.value, alias.value, expiresAt.value);
    const onDelete = () => store.deleteUrl(store.shortUrl);

    return {
      originalUrl,
      alias,
      expiresAt,
      onSubmit,
      onDelete,
      shortUrl: store.shortUrl,
      loading: store.loading,
      error: store.error,
    };
  },
});
</script>
