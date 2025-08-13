<template>
  <div>
    <h2>Статистика для {{ shortUrl }}</h2>
    <Analytics :data="store.analytics ?? { totalClicks: 0, lastClicks: [] }" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import Analytics from "../components/Analytics.vue";
import { useUrlStore } from "../stores/urlStore";

export default defineComponent({
  components: { Analytics },
  setup() {
    const route = useRoute();
    const shortUrl = route.params.shortUrl as string;
    const store = useUrlStore();
    onMounted(() => store.fetchAnalytics(shortUrl));
    return { store, shortUrl };
  },
});
</script>
