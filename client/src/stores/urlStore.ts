import { defineStore } from "pinia";
import api from "@/utils/api";
import type { Url, CreateUrlPayload, AnalyticsData } from "@/types/url";

export const useUrlStore = defineStore("url", {
  state: () => ({
    urls: [] as Url[],
    currentUrl: null as Url | null,
    analytics: null as AnalyticsData | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async createUrl(payload: CreateUrlPayload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/shorten", payload);
        const newUrl = response.data;
        this.urls.push(newUrl);
        return newUrl;
      } catch (err: any) {
        this.error =
          err.response?.data?.error ||
          err.message ||
          "Failed to create short URL";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchUrlInfo(shortUrl: string) {
      this.loading = true;
      this.currentUrl = null;
      this.error = null;
      try {
        const response = await api.get(`/api/info/${shortUrl}`);
        this.currentUrl = response.data;
      } catch (err: any) {
        this.error = err.message || "Failed to fetch URL info";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchAnalytics(shortUrl: string) {
      this.loading = true;
      this.analytics = null;
      this.error = null;
      try {
        const response = await api.get(`/api/analytics/${shortUrl}`);
        this.analytics = response.data;
      } catch (err: any) {
        this.error = err.message || "Failed to fetch analytics";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteUrl(shortUrl: string) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/api/delete/${shortUrl}`);
        this.urls = this.urls.filter((url) => url.shortUrl !== shortUrl);
        if (this.currentUrl?.shortUrl === shortUrl) {
          this.currentUrl = null;
        }
        return true;
      } catch (err: any) {
        this.error = err.message || "Failed to delete URL";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
