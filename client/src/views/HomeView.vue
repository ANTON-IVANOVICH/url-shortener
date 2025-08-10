<script setup lang="ts">
import UrlForm from "@/components/UrlForm.vue";
</script>

<template>
  <div class="home">
    <h1>URL Shortener</h1>
    <UrlForm />
  </div>
</template>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
