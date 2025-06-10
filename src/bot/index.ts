import { Telegraf, session } from 'telegraf';
import { PrismaClient } from '@prisma/client';
import { generateOneTimePassword } from '../utils/auth';

const prisma = new PrismaClient();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

// Extend session interface
interface BotSession {
  isAuthenticated: boolean;
  currentCompany?: {
    id?: string;
    name?: string;
    logo?: string;
    category?: string;
    slogan?: string;
    shortDescription?: string;
    description?: string;
    benefits?: string[];
    bonus?: string;
    contactCta?: string;
    contactUrl?: string;
  };
}

// Initialize session
bot.use(session());

// Authentication middleware
const requireAuth = async (ctx: any, next: () => Promise<void>) => {
  if (!ctx.session.isAuthenticated) {
    await ctx.reply('Пожалуйста, авторизуйтесь с помощью команды /auth');
    return;
  }
  return next();
};

// Generate and send one-time password
bot.command('generate_password', async (ctx) => {
  const password = generateOneTimePassword();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.adminAuth.create({
    data: {
      password,
      expiresAt,
    },
  });

  // In production, send this to admin's email or secure channel
  await ctx.reply(`Одноразовый пароль: ${password}\nДействителен 15 минут`);
});

// Authentication command
bot.command('auth', async (ctx) => {
  const password = ctx.message.text.split(' ')[1];
  if (!password) {
    await ctx.reply('Пожалуйста, укажите пароль: /auth <пароль>');
    return;
  }

  const auth = await prisma.adminAuth.findFirst({
    where: {
      password,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!auth) {
    await ctx.reply('Неверный или просроченный пароль');
    return;
  }

  await prisma.adminAuth.update({
    where: { id: auth.id },
    data: { used: true },
  });

  ctx.session.isAuthenticated = true;
  await ctx.reply('Авторизация успешна!');
});

// Start adding new company
bot.command('add_company', requireAuth, async (ctx) => {
  ctx.session.currentCompany = {};
  await ctx.reply('Введите название компании:');
});

// Handle company data input
bot.on('text', requireAuth, async (ctx) => {
  const company = ctx.session.currentCompany;
  if (!company) return;

  if (!company.name) {
    company.name = ctx.message.text;
    await ctx.reply('Введите URL логотипа:');
  } else if (!company.logo) {
    company.logo = ctx.message.text;
    await ctx.reply('Выберите категорию:', {
      reply_markup: {
        keyboard: [
          ['POS и кассы', 'CRM и маркетинг'],
          ['Доставка и логистика', 'Онлайн-оплата'],
          ['Оборудование', 'Кадровые решения'],
          ['Обучение и франшизы'],
        ],
      },
    });
  } else if (!company.category) {
    company.category = ctx.message.text;
    await ctx.reply('Введите слоган:');
  } else if (!company.slogan) {
    company.slogan = ctx.message.text;
    await ctx.reply('Введите краткое описание:');
  } else if (!company.shortDescription) {
    company.shortDescription = ctx.message.text;
    await ctx.reply('Введите полное описание:');
  } else if (!company.description) {
    company.description = ctx.message.text;
    await ctx.reply('Введите преимущества (каждое с новой строки):');
  } else if (!company.benefits) {
    company.benefits = ctx.message.text.split('\n');
    await ctx.reply('Введите бонус (или отправьте "-" если нет):');
  } else if (!company.bonus) {
    company.bonus = ctx.message.text === '-' ? '' : ctx.message.text;
    await ctx.reply('Введите текст кнопки контакта:');
  } else if (!company.contactCta) {
    company.contactCta = ctx.message.text;
    await ctx.reply('Введите URL для контакта:');
  } else if (!company.contactUrl) {
    company.contactUrl = ctx.message.text;
    
    // Save company to database
    await prisma.company.create({
      data: {
        name: company.name,
        logo: company.logo,
        category: company.category,
        slogan: company.slogan,
        shortDescription: company.shortDescription,
        description: company.description,
        benefits: company.benefits,
        bonus: company.bonus,
        contactCta: company.contactCta,
        contactUrl: company.contactUrl,
      },
    });

    await ctx.reply('Компания успешно добавлена!');
    ctx.session.currentCompany = undefined;
  }
});

// List all companies
bot.command('list_companies', requireAuth, async (ctx) => {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'desc' },
  });

  if (companies.length === 0) {
    await ctx.reply('Нет добавленных компаний');
    return;
  }

  const message = companies
    .map((c) => `${c.name} (${c.category})\nID: ${c.id}`)
    .join('\n\n');
  
  await ctx.reply(message);
});

// Start the bot
bot.launch().then(() => {
  console.log('Bot started');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 