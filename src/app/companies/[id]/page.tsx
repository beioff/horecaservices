'use client';

import { useState } from 'react';
import { companies, categories } from '@/companies';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

export function generateStaticParams() {
  return companies.map((company) => ({
    id: company.id,
  }));
}

export default function CompanyPage({ params }: { params: { id: string } }) {
  const [showContactForm, setShowContactForm] = useState(false);
  const company = companies.find(c => c.id === params.id);

  if (!company) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Компания не найдена</h1>
          <a href="/" className="btn btn-primary">
            Вернуться на главную
          </a>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === company.category);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 rounded-b-[3rem] shadow-soft py-8 px-4 md:px-8">
        <div className="container-custom flex items-center justify-between">
          <a href="/" className="text-3xl font-extrabold gradient-text tracking-tight rounded-2xl px-6 py-3 bg-beige-100/50 hover:bg-beige-100 transition-colors duration-200">
            HoReCa
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Company Header */}
          <div className="flex items-center gap-8 mb-12">
            <div className="w-32 h-32 rounded-3xl bg-beige-50 overflow-hidden">
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-contain p-6"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-4">{company.name}</h1>
              <div className="flex items-center gap-4">
                <span className="tag tag-primary">
                  {category?.name}
                </span>
                <button
                  onClick={() => setShowContactForm(true)}
                  className="btn btn-primary hover-glow"
                >
                  {company.contactCta}
                </button>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-12">
            {/* Slogan */}
            <div className="text-2xl text-neutral-800 font-semibold">
              {company.slogan}
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <p className="text-neutral-600">
                {company.shortDescription}
              </p>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Преимущества</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-6 rounded-2xl bg-white shadow-soft"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-lg text-neutral-800">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonus */}
            {company.bonus && (
              <div className="bg-primary/10 text-primary rounded-3xl px-8 py-6 text-xl font-medium">
                {company.bonus}
              </div>
            )}

            {/* Contact CTA */}
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                Готовы начать?
              </h2>
              <p className="text-xl text-neutral-600 mb-8">
                Оставьте заявку, и мы свяжемся с вами в удобное время
              </p>
              <button
                onClick={() => setShowContactForm(true)}
                className="btn btn-primary hover-glow text-lg px-12 py-4"
              >
                {company.contactCta}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Contact Form */}
      <ContactForm
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
        companyId={company.id}
      />

      {/* Footer */}
      <footer className="mt-16 glass-effect rounded-t-[3rem] shadow-soft py-12 px-4 md:px-0">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-extrabold gradient-text tracking-tight rounded-2xl px-6 py-3 bg-beige-100/50 hover:bg-beige-100 transition-colors duration-200">
              HoReCa
            </span>
            <span className="text-neutral-600 text-lg">
              — услуги для вашего бизнеса
            </span>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="https://github.com/beioff/horecaservices" target="_blank" rel="noopener noreferrer" className="nav-link">
              GitHub
            </a>
            <a href="/" className="nav-link">
              На главную
            </a>
          </div>
          <div className="text-neutral-400 text-sm mt-4 md:mt-0">© {new Date().getFullYear()} HoReCa. Все права защищены.</div>
        </div>
      </footer>
    </div>
  );
} 