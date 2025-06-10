'use client';

import { useState, useEffect } from 'react';
import { companies, categories } from '@/companies';
import Link from 'next/link';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredCompanies = companies
    .filter((company) => !selectedCategory || company.category === selectedCategory)
    .filter((company) => 
      searchQuery === '' || 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.slogan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 rounded-b-[3rem] shadow-soft py-8 px-4 md:px-8">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-extrabold gradient-text tracking-tight rounded-2xl px-6 py-3 bg-beige-100/50 hover:bg-beige-100 transition-colors duration-200">
              HoReCa
            </span>
            <span className="hidden md:inline text-neutral-600 text-xl font-medium">
              — услуги для вашего бизнеса
            </span>
          </div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск сервисов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-12 pr-6 w-[250px] md:w-[350px]"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center gap-3"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Фильтры
            </button>
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      <div className={`container-custom transition-all duration-500 overflow-hidden ${showFilters ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="py-8">
          <div className="flex flex-wrap gap-4">
            <button
              className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedCategory(null)}
            >
              Все
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`btn ${selectedCategory === category.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="container-custom section text-center">
        <div className={`max-w-5xl mx-auto ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h1 className="mb-8 leading-tight">
            B2B-решения для HoReCa<br />
            <span className="gradient-text">Сервисы и продукты для роста вашего бизнеса</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-700 mb-12 rounded-3xl bg-beige-50/80 px-8 py-6 shadow-soft">
            Найдите лучшие сервисы и продукты для автоматизации, маркетинга, доставки, оплаты и управления в сфере общественного питания.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="#offers"
              className="btn btn-primary"
            >
              Смотреть предложения
            </a>
            <button className="btn btn-outline">
              Узнать больше
            </button>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section id="offers" className="container-custom section">
        <div className="flex items-center justify-between mb-16">
          <h2>Актуальные предложения</h2>
          <div className="text-neutral-600 text-xl">
            Найдено: {filteredCompanies.length}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCompanies.map((company, index) => (
            <div
              key={company.id}
              className={`card p-8 hover-card ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-beige-50 mr-6 overflow-hidden">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain p-3"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">{company.name}</h3>
                  <span className="tag tag-primary">
                    {categories.find(c => c.id === company.category)?.name}
                  </span>
                </div>
              </div>
              <div className="mb-4 text-xl text-neutral-800 font-semibold">{company.slogan}</div>
              <div className="mb-6 text-neutral-600">{company.shortDescription}</div>
              <div className="flex flex-wrap gap-3 mb-6">
                {company.benefits.map((benefit, idx) => (
                  <span
                    key={idx}
                    className="tag"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
              {company.bonus && (
                <div className="bg-primary/10 text-primary rounded-2xl px-6 py-4 mb-6 text-lg font-medium">
                  {company.bonus}
                </div>
              )}
              <Link
                href={`/companies/${company.id}`}
                className="btn btn-primary w-full"
              >
                {company.contactCta}
              </Link>
            </div>
          ))}
        </div>
        {filteredCompanies.length === 0 && (
          <div className="text-center py-16">
            <div className="text-neutral-400 text-xl mb-6">Ничего не найдено</div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              className="btn btn-outline"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </section>

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
            <a href="#offers" className="nav-link">
              Предложения
            </a>
          </div>
          <div className="text-neutral-400 text-sm mt-4 md:mt-0">© {new Date().getFullYear()} HoReCa. Все права защищены.</div>
        </div>
      </footer>
    </div>
  );
}
