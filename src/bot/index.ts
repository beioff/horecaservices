import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { categories } from '../companies.js';
import { addOffer, deleteOffer, getOffers } from './offers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Initialize bot with your token
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
}

const bot = new TelegramBot(token, { polling: true });

// Store authorized users
const authorizedUsers = new Set<number>();

// Owner's Telegram ID
const OWNER_ID = parseInt(process.env.TELEGRAM_OWNER_ID || '217431589');

// Store temporary offer data
interface TempOffer {
  id: string;
  name: string;
  logo: string;
  category: string;
  slogan: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  bonus: string;
  contactCta: string;
  contactUrl: string;
  companyId: string;
}

const tempOffers = new Map<number, Partial<TempOffer>>();

// Handle /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  
  // If this is the owner, authorize immediately
  if (chatId === OWNER_ID) {
    authorizedUsers.add(chatId);
    await bot.sendMessage(chatId, 'Вы авторизованы как владелец бота.');
    return;
  }

  // If user is not authorized, send request to owner
  if (!authorizedUsers.has(chatId)) {
    // Send login request to owner
    await bot.sendMessage(OWNER_ID, `Новый запрос на авторизацию от пользователя ${msg.from?.username || chatId}`);
    await bot.sendMessage(OWNER_ID, 'Для авторизации пользователя, нажмите кнопку:', {
      reply_markup: {
        inline_keyboard: [[
          { 
            text: 'Авторизовать пользователя', 
            callback_data: `auth_${chatId}`
          }
        ]]
      }
    });

    await bot.sendMessage(chatId, 'Запрос на авторизацию отправлен владельцу бота. Пожалуйста, подождите.');
    return;
  }

  await bot.sendMessage(chatId, 'Вы уже авторизованы!');
});

// Handle /newoffer command
bot.onText(/\/newoffer/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (!authorizedUsers.has(chatId)) {
    await bot.sendMessage(chatId, 'Вы не авторизованы.');
    return;
  }

  // Initialize new offer
  tempOffers.set(chatId, {
    id: '',
    name: '',
    logo: '',
    category: '',
    slogan: '',
    shortDescription: '',
    description: '',
    benefits: [],
    bonus: '',
    contactCta: '',
    contactUrl: '',
    companyId: ''
  });

  // Start with company ID
  await bot.sendMessage(chatId, 'Введите идентификатор компании (например, r_keeper):');
});

// Handle callback queries (button clicks)
bot.on('callback_query', async (callbackQuery) => {
  if (!callbackQuery.message || !callbackQuery.data) return;

  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data.startsWith('auth_') && chatId === OWNER_ID) {
    const targetUserId = parseInt(data.split('_')[1]);

    authorizedUsers.add(targetUserId);
    await bot.sendMessage(OWNER_ID, `Пользователь ${targetUserId} успешно авторизован.`);
    await bot.sendMessage(targetUserId, 'Авторизация успешна!');
    
    // Answer callback query to remove loading state
    await bot.answerCallbackQuery(callbackQuery.id);
  } else if (data.startsWith('category_')) {
    const categoryId = data.split('_')[1];
    const tempOffer = tempOffers.get(chatId);
    
    if (tempOffer) {
      tempOffer.category = categoryId;
      await bot.sendMessage(chatId, 'Введите краткое описание компании:');
    }
    
    await bot.answerCallbackQuery(callbackQuery.id);
  } else if (data === 'publish_offer') {
    const tempOffer = tempOffers.get(chatId);
    if (tempOffer) {
      try {
        await addOffer(tempOffer as TempOffer);
        await bot.sendMessage(chatId, 'Оффер успешно опубликован!');
        tempOffers.delete(chatId);
      } catch (error) {
        await bot.sendMessage(chatId, 'Ошибка при публикации оффера. Попробуйте еще раз.');
        console.error('Error publishing offer:', error);
      }
    }
    await bot.answerCallbackQuery(callbackQuery.id);
  } else if (data === 'restart_offer') {
    tempOffers.delete(chatId);
    await bot.sendMessage(chatId, 'Создание оффера начато заново. Введите название компании:');
    await bot.answerCallbackQuery(callbackQuery.id);
  }
});

// Handle /deleteoffer command
bot.onText(/\/deleteoffer (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  
  if (!authorizedUsers.has(chatId)) {
    await bot.sendMessage(chatId, 'Вы не авторизованы.');
    return;
  }

  const offerId = match?.[1];
  if (!offerId) {
    await bot.sendMessage(chatId, 'Пожалуйста, укажите ID оффера для удаления.');
    return;
  }

  try {
    await deleteOffer(offerId);
    await bot.sendMessage(chatId, `Оффер ${offerId} успешно удален!`);
  } catch (error) {
    await bot.sendMessage(chatId, 'Ошибка при удалении оффера. Проверьте ID и попробуйте снова.');
    console.error('Error deleting offer:', error);
  }
});

// Handle /listoffers command
bot.onText(/\/listoffers/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (!authorizedUsers.has(chatId)) {
    await bot.sendMessage(chatId, 'Вы не авторизованы.');
    return;
  }

  const offers = await getOffers();
  if (offers.length === 0) {
    await bot.sendMessage(chatId, 'Нет доступных офферов.');
    return;
  }

  const offersList = offers.map(offer => 
    `ID: ${offer.id}\nНазвание: ${offer.name}\nКатегория: ${categories.find(c => c.id === offer.category)?.name}\n\n`
  ).join('---\n');

  await bot.sendMessage(chatId, `Список офферов:\n\n${offersList}\n\nДля удаления оффера используйте команду /deleteoffer <ID>`);
});

// Handle text messages for offer creation
bot.on('message', async (msg) => {
  if (!msg.text || !authorizedUsers.has(msg.chat.id)) return;

  const chatId = msg.chat.id;
  const tempOffer = tempOffers.get(chatId);

  if (!tempOffer) return;

  // Handle offer creation step by step
  if (!tempOffer.companyId) {
    tempOffer.companyId = msg.text;
    await bot.sendMessage(chatId, 'Введите название компании:');
  } else if (!tempOffer.name) {
    tempOffer.name = msg.text;
    tempOffer.id = msg.text.toLowerCase().replace(/[^a-z0-9]/g, '_');
    await bot.sendMessage(chatId, 'Введите слоган компании:');
  } else if (!tempOffer.slogan) {
    tempOffer.slogan = msg.text;
    await bot.sendMessage(chatId, 'Выберите категорию:', {
      reply_markup: {
        inline_keyboard: categories.map(cat => [{
          text: cat.name,
          callback_data: `category_${cat.id}`
        }])
      }
    });
  } else if (!tempOffer.category) {
    // Category is handled by callback
    return;
  } else if (!tempOffer.shortDescription) {
    tempOffer.shortDescription = msg.text;
    await bot.sendMessage(chatId, 'Введите полное описание компании:');
  } else if (!tempOffer.description) {
    tempOffer.description = msg.text;
    await bot.sendMessage(chatId, 'Введите преимущества компании (по одному в сообщении, отправьте /done когда закончите):');
  } else if (!tempOffer.benefits) {
    if (msg.text === '/done') {
      await bot.sendMessage(chatId, 'Введите бонусное предложение (или отправьте /skip если нет):');
    } else {
      if (!tempOffer.benefits) tempOffer.benefits = [];
      tempOffer.benefits.push(msg.text);
      await bot.sendMessage(chatId, 'Введите следующее преимущество или отправьте /done когда закончите:');
    }
  } else if (!tempOffer.bonus) {
    if (msg.text === '/skip') {
      tempOffer.bonus = '';
    } else {
      tempOffer.bonus = msg.text;
    }
    await bot.sendMessage(chatId, 'Введите текст кнопки для связи (например, "Оставить заявку"):');
  } else if (!tempOffer.contactCta) {
    tempOffer.contactCta = msg.text;
    await bot.sendMessage(chatId, 'Введите URL для кнопки связи (или отправьте /skip если нет):');
  } else if (!tempOffer.contactUrl) {
    if (msg.text === '/skip') {
      tempOffer.contactUrl = '#';
    } else {
      tempOffer.contactUrl = msg.text;
    }
    
    // Show final offer for review
    const offer = tempOffers.get(chatId);
    if (offer) {
      await bot.sendMessage(chatId, 'Проверьте данные оффера:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: '✅ Опубликовать', callback_data: 'publish_offer' }],
            [{ text: '🔄 Начать заново', callback_data: 'restart_offer' }]
          ]
        }
      });
      
      // Send offer details
      await bot.sendMessage(chatId, 
        `*Название:* ${offer.name}\n` +
        `*Слоган:* ${offer.slogan}\n` +
        `*Категория:* ${categories.find(c => c.id === offer.category)?.name}\n` +
        `*Краткое описание:* ${offer.shortDescription}\n` +
        `*Полное описание:* ${offer.description}\n` +
        `*Преимущества:*\n${offer.benefits?.map(b => `- ${b}`).join('\n')}\n` +
        `*Бонус:* ${offer.bonus || 'Нет'}\n` +
        `*Кнопка связи:* ${offer.contactCta}\n` +
        `*URL кнопки:* ${offer.contactUrl}`,
        { parse_mode: 'Markdown' }
      );
    }
  }
});

console.log('Bot is running...'); 