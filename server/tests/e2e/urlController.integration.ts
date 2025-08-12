// import request from 'supertest';
// import createApp from '../../src/app';
// import prisma from '../../src/db';
// import { describe, beforeEach, afterAll, it } from '@jest/globals';

// const app = createApp();

// describe('POST /api/shorten и редирект', () => {
//   beforeEach(async () => {
//     await prisma.click.deleteMany();
//     await prisma.url.deleteMany();
//   });
//   afterAll(async () => await prisma.$disconnect());

//   it('возвращает 404 при несуществующем коде', async () => {
//     await request(app).get('/api/invalid').expect(404).expect({ error: 'URL not found' });
//   });
// });
