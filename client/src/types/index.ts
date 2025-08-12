export interface UrlResponse {
  shortUrl: string;
}

export interface UrlInfo {
  originalUrl: string;
  createdAt: string;
  clickCount: number;
  expiresAt?: string;
}

export interface Analytics {
  totalClicks: number;
  lastClicks: { ipAddress: string; clickedAt: string }[];
}
