'use client';

import { useState } from 'react';
import { companies, categories } from '@/companies';
import Link from 'next/link';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCompanies = selectedCategory
    ? companies.filter((company) => company.category === selectedCategory)
    : companies;

  return (
    <div className="min-h-screen bg-light">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-dark to-dark/90 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            Каталог компаний для HoReCa
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Найдите лучшие решения для вашего бизнеса в сфере общественного питания
          </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Категории</h2>
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-6 py-3 rounded-full transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              Все
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-6 py-3 rounded-full transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Link href={`/companies/${company.id}`} key={company.id}>
              <div className="card p-6 hover:scale-[1.02] transition-transform duration-200">
                <div className="flex items-center mb-4">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-12 h-12 object-contain mr-4"
                  />
                  <h3 className="text-xl font-bold">{company.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{company.slogan}</p>
                <p className="text-gray-700 mb-6">{company.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {company.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary text-dark rounded-full text-sm"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
                {company.bonus && (
                  <div className="bg-primary/10 text-primary rounded-lg p-3 mb-4">
                    <p className="font-medium">{company.bonus}</p>
                  </div>
                )}
                <button className="btn btn-primary w-full">
                  {company.contactCta}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
