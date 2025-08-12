<template>
  <div v-if="data">
    <p>Total Clicks: {{ data.totalClicks }}</p>
    <table>
      <thead>
        <tr>
          <th>IP Address</th>
          <th>Clicked At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(click, idx) in data.lastClicks" :key="idx">
          <td>{{ click.ipAddress }}</td>
          <td>{{ formatDate(click.clickedAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<{
        totalClicks: number;
        lastClicks: { ipAddress: string; clickedAt: string }[];
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
