export interface Url {
  id: string;
  originalUrl: string;
  shortUrl: string;
  alias?: string;
  createdAt: Date;
  expiresAt?: Date;
  clickCount: number;
}

export interface CreateUrlPayload {
  originalUrl: string;
  alias?: string;
  expiresAt?: string | Date;
}

export interface AnalyticsData {
  totalClicks: number;
  lastClicks: Array<{
    ipAddress: string;
    clickedAt: Date;
  }>;
}
