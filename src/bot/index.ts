import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs/promises';
import { categories } from '../companies.ts';
import { addOffer, deleteOffer, updateOffer } from './offers.ts';

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
  logoFileId?: string;
}

const tempOffers = new Map<number, Partial<TempOffer>>();
const userStates = new Map<number, string>();

// Function to show main menu
async function showMainMenu(chatId: number) {
  await bot.sendMessage(chatId, 'Выберите действие:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: '➕ Добавить новый оффер', callback_data: 'new_offer' }],
        [{ text: '🗑 Удалить оффер', callback_data: 'delete_offer' }],
        [{ text: '📝 Редактировать оффер', callback_data: 'edit_offer' }]
      ]
    }
  });
}

// Handle /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  
  // If this is the owner, authorize immediately
  if (chatId === OWNER_ID) {
    authorizedUsers.add(chatId);
    await bot.sendMessage(chatId, 'Вы авторизованы как владелец бота.');
    await showMainMenu(chatId);
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
  await showMainMenu(chatId);
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
    contactUrl: ''
  });

  userStates.set(chatId, 'waiting_for_name');
  await bot.sendMessage(chatId, 'Введите название компании:');
});

// Handle /deleteoffer command
bot.onText(/\/deleteoffer (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  
  if (!authorizedUsers.has(chatId)) {
    await bot.sendMessage(chatId, 'Вы не авторизованы.');
    return;
  }

  if (!match) {
    await bot.sendMessage(chatId, 'Неверный формат команды. Используйте: /deleteoffer <id>');
    return;
  }

  const offerId = match[1];
  try {
    await deleteOffer(offerId);
    await bot.sendMessage(chatId, `Оффер ${offerId} успешно удален.`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    await bot.sendMessage(chatId, `Ошибка при удалении оффера: ${errorMessage}`);
  }
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
    await showMainMenu(targetUserId);
    await bot.answerCallbackQuery(callbackQuery.id);
  } else if (data === 'new_offer') {
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
      contactUrl: ''
    });
    userStates.set(chatId, 'waiting_for_name');
    await bot.sendMessage(chatId, 'Введите название компании:');
    await bot.answerCallbackQuery(callbackQuery.id);
  } else if (data === 'delete_offer') {
    const companiesList = categories.map(c => `ID: ${c.id} - ${c.name}`).join('\n');
    await bot.sendMessage(chatId, `Введите ID оффера для удаления:\n\n${companiesList}`);
    await bot.answerCallbackQuery(callbackQuery.id);
  } else if (data === 'edit_offer') {
    const companiesList = categories.map(c => `ID: ${c.id} - ${c.name}`).join('\n');
    await bot.sendMessage(chatId, `Введите ID оффера для редактирования:\n\n${companiesList}`);
    await bot.answerCallbackQuery(callbackQuery.id);
  } else if (data.startsWith('category_')) {
    const categoryId = data.split('_')[1];
    const tempOffer = tempOffers.get(chatId);
    
    if (tempOffer) {
      tempOffer.category = categoryId;
      userStates.set(chatId, 'waiting_for_logo');
      await bot.sendMessage(chatId, 'Отправьте логотип компании (изображение):');
    }
    
    await bot.answerCallbackQuery(callbackQuery.id);
  } else if (data === 'publish_offer') {
    const tempOffer = tempOffers.get(chatId);
    if (tempOffer) {
      try {
        console.log('Attempting to publish offer:', tempOffer);
        await addOffer(tempOffer as TempOffer);
        console.log('Offer published successfully');
        await bot.sendMessage(chatId, 'Оффер успешно опубликован!');
        tempOffers.delete(chatId);
        userStates.delete(chatId);
      } catch (error) {
        console.error('Error publishing offer:', error);
        await bot.sendMessage(chatId, `Ошибка при публикации оффера: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      }
    }
    await bot.answerCallbackQuery(callbackQuery.id);
  } else if (data === 'restart_offer') {
    tempOffers.delete(chatId);
    userStates.delete(chatId);
    await bot.sendMessage(chatId, 'Создание оффера начато заново. Введите название компании:');
    await bot.answerCallbackQuery(callbackQuery.id);
  }
});

// Handle text messages for offer creation
bot.on('message', async (msg) => {
  if (!msg.text || !authorizedUsers.has(msg.chat.id)) return;

  const chatId = msg.chat.id;
  const tempOffer = tempOffers.get(chatId);
  const state = userStates.get(chatId);

  if (!tempOffer || !state) return;

  switch (state) {
    case 'waiting_for_name':
      tempOffer.name = msg.text;
      tempOffer.id = msg.text.toLowerCase().replace(/[^a-z0-9]/g, '_');
      userStates.set(chatId, 'waiting_for_slogan');
      await bot.sendMessage(chatId, 'Введите слоган компании:');
      break;

    case 'waiting_for_slogan':
      tempOffer.slogan = msg.text;
      userStates.set(chatId, 'waiting_for_category');
      await bot.sendMessage(chatId, 'Выберите категорию:', {
        reply_markup: {
          inline_keyboard: categories.map(cat => [{
            text: cat.name,
            callback_data: `category_${cat.id}`
          }])
        }
      });
      break;

    case 'waiting_for_short_description':
      tempOffer.shortDescription = msg.text;
      userStates.set(chatId, 'waiting_for_description');
      await bot.sendMessage(chatId, 'Введите полное описание компании:');
      break;

    case 'waiting_for_description':
      tempOffer.description = msg.text;
      userStates.set(chatId, 'waiting_for_benefits');
      await bot.sendMessage(chatId, 'Введите преимущества компании (по одному в сообщении, отправьте /done когда закончите):');
      break;

    case 'waiting_for_benefits':
      if (msg.text === '/done') {
        userStates.set(chatId, 'waiting_for_bonus');
        await bot.sendMessage(chatId, 'Введите бонусное предложение (или отправьте /skip если нет):');
      } else {
        if (!tempOffer.benefits) tempOffer.benefits = [];
        tempOffer.benefits.push(msg.text);
        await bot.sendMessage(chatId, 'Введите следующее преимущество или отправьте /done когда закончите:');
      }
      break;

    case 'waiting_for_bonus':
      if (msg.text === '/skip') {
        tempOffer.bonus = '';
      } else {
        tempOffer.bonus = msg.text;
      }
      userStates.set(chatId, 'waiting_for_contact_cta');
      await bot.sendMessage(chatId, 'Введите текст кнопки для связи (например, "Оставить заявку"):');
      break;

    case 'waiting_for_contact_cta':
      tempOffer.contactCta = msg.text;
      userStates.set(chatId, 'waiting_for_contact_url');
      await bot.sendMessage(chatId, 'Введите URL для кнопки связи (или отправьте /skip если нет):');
      break;

    case 'waiting_for_contact_url':
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
      break;
  }
});

// Handle photo messages
bot.on('photo', async (msg) => {
  if (!msg.photo || !authorizedUsers.has(msg.chat.id)) return;

  const chatId = msg.chat.id;
  const tempOffer = tempOffers.get(chatId);
  const state = userStates.get(chatId);

  if (!tempOffer || state !== 'waiting_for_logo') return;

  // Get the largest photo size
  const photo = msg.photo[msg.photo.length - 1];
  tempOffer.logoFileId = photo.file_id;

  // Download the file
  const file = await bot.getFile(photo.file_id);
  const filePath = file.file_path;
  const fileName = `${tempOffer.id}.png`;
  const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

  // Download and save the file
  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const logoPath = path.join(__dirname, '../../public/logos', fileName);
  await fs.writeFile(logoPath, buffer);

  tempOffer.logo = `/logos/${fileName}`;
  userStates.set(chatId, 'waiting_for_short_description');
  await bot.sendMessage(chatId, 'Введите краткое описание компании:');
});

console.log('Bot is running...'); 