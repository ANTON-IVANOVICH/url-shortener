import { Request, Response } from 'express';
import { generateShortCode, isUrlExpired } from '@/utils/helpers';
import prisma from '@/db';

export const shortenUrl = async (req: Request, res: Response) => {
  const { originalUrl, alias, expiresAt } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'originalUrl is required' });
  }

  try {
    if (alias) {
      const existingAlias = await prisma.url.findUnique({ where: { alias } });
      if (existingAlias) {
        return res.status(409).json({ error: 'Alias already exists' });
      }
    }

    const url = await prisma.url.create({
      data: {
        originalUrl,
        shortUrl: alias || generateShortCode(6),
        alias: alias || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(201).json({
      shortUrl: url.shortUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const redirectUrl = async (req: Request, res: Response) => {
  try {
    const url = await prisma.url.findUnique({
      where: { shortUrl: req.params.shortUrl },
      select: { id: true, originalUrl: true, expiresAt: true },
    });

    if (!url) {
      return res.status(404).send('URL not found');
    }

    if (url.expiresAt && new Date() > new Date(url.expiresAt)) {
      return res.status(410).send('URL has expired');
    }

    // Обновляем счетчик кликов
    await prisma.$transaction([
      prisma.url.update({
        where: { id: url.id },
        data: { clickCount: { increment: 1 } },
      }),
      prisma.click.create({
        data: {
          urlId: url.id,
          ipAddress: req.ip || 'unknown',
        },
      }),
    ]);

    res.redirect(302, url.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

export const getUrlInfo = async (req: Request, res: Response) => {
  const { shortUrl } = req.params;

  try {
    const url = await prisma.url.findUnique({
      where: { shortUrl },
      include: {
        clicks: {
          orderBy: { clickedAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      clickCount: url.clickCount,
      expiresAt: url.expiresAt,
      lastClicks: url.clicks.map((click) => ({
        clickedAt: click.clickedAt,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Удаление ссылки
export const deleteUrl = async (req: Request, res: Response) => {
  const { shortUrl } = req.params;

  try {
    const url = await prisma.url.findUnique({ where: { shortUrl } });
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    await prisma.url.delete({ where: { id: url.id } });

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  const { shortUrl } = req.params;

  try {
    const url = await prisma.url.findUnique({
      where: { shortUrl },
      include: {
        clicks: {
          orderBy: { clickedAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      totalClicks: url.clickCount,
      lastClicks: url.clicks.map((click) => ({
        ipAddress: click.ipAddress,
        clickedAt: click.clickedAt,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
