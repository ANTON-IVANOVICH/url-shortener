<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUrlStore } from "@/stores/urlStore";

const route = useRoute();
const router = useRouter();
const urlStore = useUrlStore();
const shortUrl = ref(route.params.shortUrl as string);

onMounted(async () => {
  try {
    await urlStore.fetchUrlInfo(shortUrl.value);
    await urlStore.fetchAnalytics(shortUrl.value);
  } catch (error) {
    console.error("Failed to load URL info:", error);
  }
});

const deleteUrl = async () => {
  if (confirm("Are you sure you want to delete this URL?")) {
    await urlStore.deleteUrl(shortUrl.value);
    router.push("/");
  }
};

// const getFullShortUrl = (shortUrl: string) => {
//   return `${window.location.origin}/${shortUrl}`;
// };
</script>

<template>
  <div class="url-info">
    <h1>URL Information</h1>

    <div v-if="urlStore.loading">Loading...</div>
    <div v-else-if="urlStore.currentUrl">
      <div class="info-card">
        <p>
          <strong>Original URL:</strong>
          <a :href="urlStore.currentUrl.originalUrl" target="_blank">
            {{ urlStore.currentUrl.originalUrl }}
          </a>
        </p>
        <p>
          <strong>Short URL:</strong>
          <a :href="'/' + urlStore.currentUrl.shortUrl" target="_blank">
            {{ urlStore.currentUrl.shortUrl }}
          </a>
        </p>
        <p>
          <strong>Created:</strong>
          {{ new Date(urlStore.currentUrl.createdAt).toLocaleString() }}
        </p>
        <p><strong>Clicks:</strong> {{ urlStore.currentUrl.clickCount }}</p>
        <p v-if="urlStore.currentUrl.expiresAt">
          <strong>Expires:</strong>
          {{ new Date(urlStore.currentUrl.expiresAt).toLocaleString() }}
        </p>

        <button @click="deleteUrl" class="delete-btn">Delete URL</button>
      </div>

      <div class="analytics" v-if="urlStore.analytics">
        <h2>Analytics</h2>
        <p>
          <strong>Total clicks:</strong> {{ urlStore.analytics.totalClicks }}
        </p>

        <h3>Last 5 clicks:</h3>
        <ul>
          <li
            v-for="(click, index) in urlStore.analytics.lastClicks"
            :key="index"
          >
            {{ new Date(click.clickedAt).toLocaleString() }} -
            {{ click.ipAddress }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>URL not found</p>
    </div>

    <router-link to="/" class="back-link">Back to home</router-link>
  </div>
</template>

<style scoped>
.url-info {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.info-card,
.analytics {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #007bff;
  text-decoration: none;
}
</style>
