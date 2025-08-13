<template>
  <div>
    <UrlForm />
    <UrlInfo :info="store.info" v-if="store.info" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UrlForm from "../components/UrlForm.vue";
import UrlInfo from "../components/UrlInfo.vue";
import { useUrlStore } from "../stores/urlStore";

export default defineComponent({
  components: { UrlForm, UrlInfo },
  setup() {
    const store = useUrlStore();
    return { store };
  },
});
</script>
