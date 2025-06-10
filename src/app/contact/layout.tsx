import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Оставить заявку | HoReCa B2B',
  description: 'Заполните форму, чтобы получить подробную информацию о B2B-решениях для вашего ресторанного бизнеса. Мы свяжемся с вами в удобное время.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 