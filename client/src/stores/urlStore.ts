import { defineStore } from "pinia";
import api from "../plugins/axios";
import type { Analytics, UrlInfo, UrlResponse } from "../types";

export const useUrlStore = defineStore("url", {
  state: () => ({
    shortUrl: "" as string,
    info: null as UrlInfo | null,
    analytics: null as Analytics | null,
    loading: false as boolean,
    error: "" as string,
  }),
  actions: {
    async createUrl(originalUrl: string, alias?: string, expiresAt?: string) {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.post<UrlResponse>("/shorten", {
          originalUrl,
          alias,
          expiresAt,
        });
        this.shortUrl = res.data.shortUrl;
      } catch (err: any) {
        this.error = err.response?.data?.error || err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchInfo(shortUrl: string) {
      this.loading = true;
      try {
        const res = await api.get<UrlInfo>(`/info/${shortUrl}`);
        this.info = res.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchAnalytics(shortUrl: string) {
      this.loading = true;
      try {
        const res = await api.get<Analytics>(`/analytics/${shortUrl}`);
        this.analytics = res.data;
      } catch (err: any) {
        this.error = err.response?.data?.error || err.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteUrl(shortUrl: string) {
      this.loading = true;
      try {
        await api.delete(`/delete/${shortUrl}`);
        this.info = null;
        this.analytics = null;
        this.shortUrl = "";
      } catch (err: any) {
        this.error = err.response?.data?.error || err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
