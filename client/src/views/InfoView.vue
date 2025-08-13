<template>
  <div>
    <h2>Информация о ссылке {{ shortUrl }}</h2>
    <UrlInfo v-if="store.info" :info="store.info" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import UrlInfo from "../components/UrlInfo.vue";
import { useUrlStore } from "../stores/urlStore";

export default defineComponent({
  components: { UrlInfo },
  setup() {
    const route = useRoute();
    const shortUrl = route.params.shortUrl as string;
    const store = useUrlStore();
    onMounted(() => store.fetchInfo(shortUrl));
    return { store, shortUrl };
  },
});
</script>
