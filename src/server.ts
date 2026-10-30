import mongoose from 'mongoose';
import app from './app';
import { config } from './libs/utils/config';

async function startServer(): Promise<void> {
  try {
    await mongoose.connect(config.mongoUri);
    const server = app.listen(config.port, () => console.log(`Avto Market server ${config.port}-portda ishga tushdi`));
    const shutdown = async (): Promise<void> => {
      try { server.close(); await mongoose.disconnect(); process.exit(0); }
      catch (error) { console.error('Serverni to‘xtatishda xatolik:', error); process.exit(1); }
    };
    process.on('SIGINT', () => { void shutdown(); });
    process.on('SIGTERM', () => { void shutdown(); });
  } catch (error) {
    console.error('MongoDB yoki server ishga tushmadi:', error);
    process.exit(1);
  }
}

void startServer();
