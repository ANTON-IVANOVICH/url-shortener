<template>
  <div v-if="info">
    <p>Оригинальный URL: {{ info.originalUrl }}</p>
    <p>Создано: {{ formatDate(info.createdAt) }}</p>
    <p>Переходы: {{ info.clickCount }}</p>
    <p v-if="info.expiresAt">Истекает: {{ formatDate(info.expiresAt) }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  props: {
    info: {
      type: Object as PropType<{
        originalUrl: string;
        createdAt: string;
        clickCount: number;
        expiresAt?: string;
      }>,
      required: true,
    },
  },
  methods: {
    formatDate(dt: string) {
      return new Date(dt).toLocaleString();
    },
  },
});
</script>
