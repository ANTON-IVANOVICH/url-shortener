import request from 'supertest';
import { describe, beforeEach, afterAll, it, expect } from '@jest/globals';
import createApp from '../src/app';
import prisma from '../src/db';

const app = createApp();

describe('URL Controller', () => {
  beforeEach(async () => {
    await prisma.click.deleteMany();
    await prisma.url.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /shorten', () => {
    it('should create URL with unique alias', async () => {
      const response = await request(app).post('/api/shorten').send({
        originalUrl: 'https://example.com',
        alias: 'test123',
      });

      expect(response.status).toBe(201);
      expect(response.body.shortUrl).toBe('test123');
    });

    it('should return 409 for duplicate alias', async () => {
      await request(app).post('/api/shorten').send({
        originalUrl: 'https://example.com',
        alias: 'test123',
      });

      const response = await request(app).post('/api/shorten').send({
        originalUrl: 'https://another.com',
        alias: 'test123',
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Alias already exists');
    });

    it('should generate short code if alias not provided', async () => {
      const response = await request(app).post('/api/shorten').send({
        originalUrl: 'https://example.com',
      });

      expect(response.status).toBe(201);
      expect(response.body.shortUrl).toHaveLength(6);
    });
  });
});

describe('GET /:shortUrl', () => {
  it('should redirect to original URL', async () => {
    const alias = 'redirect-test';
    await request(app).post('/api/shorten').send({
      originalUrl: 'https://google.com',
      alias,
    });

    const response = await request(app).get(`/api/${alias}`);
    expect(response.status).toBe(302);
    expect(response.header.location).toBe('https://google.com');
  });

  it('should return 404 for non-existent URL', async () => {
    const response = await request(app).get('/api/invalid-url');
    expect(response.status).toBe(404);
  });

  it('should return 410 for expired URL', async () => {
    const alias = 'expired-test';
    await request(app)
      .post('/api/shorten')
      .send({
        originalUrl: 'https://google.com',
        alias,
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Вчера
      });

    const response = await request(app).get(`/api/${alias}`);
    expect(response.status).toBe(410);
  });

  it('should increment click count and record stats', async () => {
    const alias = 'stats-test';
    await request(app).post('/api/shorten').send({
      originalUrl: 'https://google.com',
      alias,
    });

    await request(app).get(`/api/${alias}`);

    const urlRecord = await prisma.url.findUnique({
      where: { shortUrl: alias },
      include: { clicks: true },
    });

    expect(urlRecord?.clickCount).toBe(1);
    expect(urlRecord?.clicks[0].ipAddress).toMatch(/(\d+\.\d+\.\d+\.\d+|::ffff:127\.0\.0\.1)/);
  });
});

describe('GET /info/:shortUrl', () => {
  it('should return URL information', async () => {
    const alias = 'info-test';
    await request(app).post('/api/shorten').send({
      originalUrl: 'https://example.com',
      alias,
    });

    const response = await request(app).get(`/api/info/${alias}`);

    expect(response.status).toBe(200);
    expect(response.body.originalUrl).toBe('https://example.com');
    expect(response.body.clickCount).toBe(0);
  });
});

describe('DELETE /delete/:shortUrl', () => {
  it('should delete URL', async () => {
    const alias = 'delete-test';
    await request(app).post('/api/shorten').send({
      originalUrl: 'https://example.com',
      alias,
    });

    const deleteResponse = await request(app).delete(`/api/delete/${alias}`);
    expect(deleteResponse.status).toBe(204);

    const getResponse = await request(app).get(`/api/info/${alias}`);
    expect(getResponse.status).toBe(404);
  });
});

describe('GET /analytics/:shortUrl', () => {
  it('should return analytics data', async () => {
    const alias = 'analytics-test';
    await request(app).post('/api/shorten').send({
      originalUrl: 'https://example.com',
      alias,
    });

    await request(app).get(`/api/${alias}`);
    await request(app).get(`/api/${alias}`);

    const response = await request(app).get(`/api/analytics/${alias}`);

    expect(response.status).toBe(200);
    expect(response.body.totalClicks).toBe(2);
    expect(response.body.lastClicks).toHaveLength(2);
    expect(response.body.lastClicks[0].ipAddress).toMatch(/(\d+\.\d+\.\d+\.\d+|::ffff:127\.0\.0\.1)/);
  });
});
