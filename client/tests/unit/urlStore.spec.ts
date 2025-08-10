import { setActivePinia, createPinia } from "pinia";
import { useUrlStore } from "../../src/stores/urlStore";
import { describe, beforeEach, it, expect, vi } from "vitest";
import type { Url, AnalyticsData } from "../../src/types/url";

vi.mock("../../src/utils/api", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from "../../src/utils/api";

describe("urlStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("successfully creates URL", async () => {
    const store = useUrlStore();
    const mockPayload = { originalUrl: "https://google.com" };
    const mockResponse: Url = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      originalUrl: "https://google.com",
      shortUrl: "abc123",
      createdAt: new Date(),
      clickCount: 0,
    };

    (api.post as any).mockResolvedValue({ data: mockResponse });

    const result = await store.createUrl(mockPayload);

    expect(api.post).toHaveBeenCalledWith("/api/shorten", mockPayload);
    expect(result).toEqual(mockResponse);
    expect(store.urls).toContainEqual(mockResponse);
    expect(store.error).toBeNull();
    expect(store.loading).toBe(false);
  });

  it("fetches URL information", async () => {
    const store = useUrlStore();
    const shortUrl = "abc123";
    const mockResponse: Url = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      originalUrl: "https://google.com",
      shortUrl: "abc123",
      createdAt: new Date(),
      clickCount: 5,
    };

    (api.get as any).mockResolvedValue({ data: mockResponse });

    await store.fetchUrlInfo(shortUrl);

    expect(api.get).toHaveBeenCalledWith(`/api/info/${shortUrl}`);
    expect(store.currentUrl).toEqual(mockResponse);
    expect(store.error).toBeNull();
  });

  it("fetches analytics data", async () => {
    const store = useUrlStore();
    const shortUrl = "abc123";
    const mockResponse: AnalyticsData = {
      totalClicks: 10,
      lastClicks: [
        { ipAddress: "192.168.0.1", clickedAt: new Date() },
        { ipAddress: "192.168.0.2", clickedAt: new Date() },
      ],
    };

    (api.get as any).mockResolvedValue({ data: mockResponse });

    await store.fetchAnalytics(shortUrl);

    expect(api.get).toHaveBeenCalledWith(`/api/analytics/${shortUrl}`);
    expect(store.analytics).toEqual(mockResponse);
    expect(store.error).toBeNull();
  });

  it("deletes URL successfully", async () => {
    const store = useUrlStore();
    const shortUrl = "abc123";

    store.urls = [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        originalUrl: "https://google.com",
        shortUrl: "abc123",
        createdAt: new Date(),
        clickCount: 0,
      },
    ];

    (api.delete as any).mockResolvedValue({});

    await store.deleteUrl(shortUrl);

    expect(api.delete).toHaveBeenCalledWith(`/api/delete/${shortUrl}`);
    expect(store.urls).toHaveLength(0);
    expect(store.error).toBeNull();
  });

  it("handles deletion error", async () => {
    const store = useUrlStore();
    const shortUrl = "abc123";
    const errorMessage = "Delete failed";

    (api.delete as any).mockRejectedValue(new Error(errorMessage));

    await expect(store.deleteUrl(shortUrl)).rejects.toThrow(errorMessage);
    expect(store.error).toBe(errorMessage);
  });
});
