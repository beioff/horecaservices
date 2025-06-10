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
      <header className="glass-effect sticky top-0 z-50 rounded-b-[2rem] shadow-soft py-6 px-4 md:px-8">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold text-neutral-900 tracking-tight rounded-xl px-4 py-2 bg-beige-100 hover:bg-beige-200 transition-colors duration-200">HoReCa</span>
            <span className="hidden md:inline text-neutral-600 text-lg font-medium ml-2">— услуги для вашего бизнеса</span>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск сервисов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 w-[200px] md:w-[300px]"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
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
              className="btn btn-outline flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
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
      <div className={`container-custom transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="py-4">
          <div className="flex flex-wrap gap-3">
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
        <div className={`max-w-4xl mx-auto ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h1 className="mb-6 leading-tight">
            B2B-решения для HoReCa<br />
            <span className="text-primary">Сервисы и продукты для роста вашего бизнеса</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-700 mb-8 rounded-2xl bg-beige-50/80 px-6 py-4 shadow-soft">
            Найдите лучшие сервисы и продукты для автоматизации, маркетинга, доставки, оплаты и управления в сфере общественного питания.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#offers"
              className="btn btn-primary text-lg"
            >
              Смотреть предложения
            </a>
            <button className="btn btn-outline text-lg">
              Узнать больше
            </button>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section id="offers" className="container-custom section">
        <div className="flex items-center justify-between mb-12">
          <h2>Актуальные предложения</h2>
          <div className="text-neutral-600">
            Найдено: {filteredCompanies.length}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCompanies.map((company, index) => (
            <div
              key={company.id}
              className={`card p-6 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-beige-50 mr-4 overflow-hidden">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">{company.name}</h3>
                  <span className="tag tag-primary">
                    {categories.find(c => c.id === company.category)?.name}
                  </span>
                </div>
              </div>
              <div className="mb-2 text-neutral-800 font-semibold">{company.slogan}</div>
              <div className="mb-4 text-neutral-600 text-sm">{company.shortDescription}</div>
              <div className="flex flex-wrap gap-2 mb-4">
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
                <div className="bg-primary/10 text-primary rounded-xl px-4 py-2 mb-4 text-sm font-medium">
                  {company.bonus}
                </div>
              )}
              <Link
                href={`/companies/${company.id}`}
                className="btn btn-primary w-full mt-auto"
              >
                {company.contactCta}
              </Link>
            </div>
          ))}
        </div>
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-neutral-400 text-lg mb-4">Ничего не найдено</div>
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
      <footer className="mt-12 glass-effect rounded-t-[2rem] shadow-soft py-8 px-4 md:px-0">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-neutral-900 tracking-tight rounded-xl px-4 py-2 bg-beige-100 hover:bg-beige-200 transition-colors duration-200">HoReCa</span>
            <span className="text-neutral-600 text-sm ml-2">— услуги для вашего бизнеса</span>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="https://github.com/beioff/horecaservices" target="_blank" rel="noopener noreferrer" className="nav-link">
              GitHub
            </a>
            <a href="#offers" className="nav-link">
              Предложения
            </a>
          </div>
          <div className="text-neutral-400 text-xs mt-4 md:mt-0">© {new Date().getFullYear()} HoReCa. Все права защищены.</div>
        </div>
      </footer>
    </div>
  );
}
