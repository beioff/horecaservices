'use client';

import { useState, useEffect } from 'react';
import { companies, categories } from '@/companies';
import Link from 'next/link';

const ITEMS_PER_PAGE = 30;

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 rounded-b-[3rem] shadow-soft py-8 px-4 md:px-8">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-extrabold gradient-text tracking-tight rounded-2xl px-6 py-3 bg-beige-100/50 hover:bg-beige-100 transition-colors duration-200 animate-float">
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
              className="btn btn-outline flex items-center gap-3 md:hidden"
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
              className="btn btn-primary hover-glow"
            >
              Смотреть предложения
            </a>
            <button className="btn btn-outline">
              Узнать больше
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="offers" className="container-custom section">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="filter-panel sticky top-32">
              <div className="filter-group">
                <h3 className="filter-title">Категории</h3>
                <button
                  className={`filter-option w-full ${selectedCategory === null ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  Все категории
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`filter-option w-full ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2>Актуальные предложения</h2>
              <div className="text-neutral-600 text-xl">
                Найдено: {filteredCompanies.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {paginatedCompanies.map((company, index) => (
                <div
                  key={company.id}
                  className={`card p-8 hover-card cursor-pointer ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => window.location.href = `/companies/${company.id}`}
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
                    href={`/request-demo/${company.id}`}
                    className="btn btn-primary w-full hover-glow"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {company.contactCta}
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </div>
            )}

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
          </div>
        </div>
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
