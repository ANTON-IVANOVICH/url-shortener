<template>
  <div class="h-full">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/info/{{ lastShortUrl }}">Info</router-link>
      <router-link to="/analytics/{{ lastShortUrl }}">Analytics</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUrlStore } from "./stores/urlStore";

export default defineComponent({
  setup() {
    const store = useUrlStore();
    return { lastShortUrl: store.shortUrl };
  },
});
</script>

<style>
nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
