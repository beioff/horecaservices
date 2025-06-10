export interface Category {
  id: string;
  name: string;
}

export interface Company {
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
}

// Категории компаний
export const categories: Category[] = [
  { id: 'pos', name: 'POS и кассы' },
  { id: 'crm', name: 'CRM и маркетинг' },
  { id: 'delivery', name: 'Доставка и логистика' },
  { id: 'payment', name: 'Онлайн-оплата' },
  { id: 'equipment', name: 'Оборудование' },
  { id: 'hr', name: 'Кадровые решения' },
  { id: 'education', name: 'Обучение и франшизы' },
];

// Компании (офферы)
export const companies: Company[] = [
  {
    id: 'r_keeper',
    name: 'R-Keeper',
    logo: '/logos/rkeeper.png',
    category: 'pos',
    slogan: 'POS-система для ресторанов',
    shortDescription: 'Мощная POS-система для автоматизации ресторанного бизнеса.',
    description: 'R-Keeper — это комплексное решение для автоматизации ресторанов, кафе и баров. Включает в себя POS-терминалы, мобильные приложения, аналитику и интеграции.',
    benefits: [
      'Интеграция с доставкой',
      'Гибкая настройка меню',
      'Отчеты и аналитика',
    ],
    bonus: 'Скидка 10% на первый месяц при заявке через агрегатор',
    contactCta: 'Оставить заявку',
    contactUrl: '#',
  },
  {
    id: 'iiko',
    name: 'iiko',
    logo: '/logos/iiko.png',
    category: 'pos',
    slogan: 'Автоматизация ресторанов и кафе',
    shortDescription: 'Облачная система управления рестораном.',
    description: 'iiko — это облачная платформа для управления рестораном: от кассы до аналитики и лояльности.',
    benefits: [
      'Мобильное приложение для персонала',
      'CRM и лояльность',
      'Интеграция с доставкой',
    ],
    bonus: '',
    contactCta: 'Запросить демо',
    contactUrl: '#',
  },
  {
    id: 'delivery_club',
    name: 'Delivery Club Business',
    logo: '/logos/deliveryclub.png',
    category: 'delivery',
    slogan: 'Доставка для ресторанов',
    shortDescription: 'Платформа для организации доставки еды.',
    description: 'Delivery Club Business — сервис для ресторанов по приему и обработке заказов на доставку.',
    benefits: [
      'Широкий охват аудитории',
      'Интеграция с POS',
      'Поддержка 24/7',
    ],
    bonus: 'Первые 10 заказов без комиссии',
    contactCta: 'Оставить заявку',
    contactUrl: '#',
  },
]; 