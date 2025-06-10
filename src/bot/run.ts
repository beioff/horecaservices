import './index';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is not set in environment variables');
  process.exit(1);
}

console.log('Starting Telegram bot...'); 