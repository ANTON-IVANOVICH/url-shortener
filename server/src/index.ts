import createApp from '@/app';
import prisma from '@/db';

const PORT = process.env.PORT;
const app = createApp();

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connection established successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
