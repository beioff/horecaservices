'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { companies } from '@/companies';

interface Company {
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

interface Category {
  id: string;
  name: string;
}

interface Data {
  companies: Company[];
  categories: Category[];
}

export default function CompanyPageClient({ params }: { params: { id: string } }) {
  const [data, setData] = useState<Data>({ companies: [], categories: [] });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Fetch data from JSON file
    fetch('/data/offers.json')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // Use static data as fallback while dynamic data is loading
  const staticCompany = companies.find((c) => c.id === params.id);
  const dynamicCompany = data.companies.find((c) => c.id === params.id);
  const company = dynamicCompany || staticCompany;

  if (!company) {
    return (
      <div className="container-custom section text-center">
        <h1 className="text-4xl font-bold mb-4">Компания не найдена</h1>
        <p className="text-xl text-neutral-600 mb-8">Запрашиваемая компания не найдена в каталоге.</p>
        <Link href="/" className="btn btn-primary">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className={`container-custom section ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-neutral-600 hover:text-neutral-900 mb-8 inline-block">
          ← Назад к списку
        </Link>

        <div className="bg-white rounded-3xl shadow-soft p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
            <div className="w-32 h-32 rounded-2xl bg-beige-50 overflow-hidden flex-shrink-0">
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4">{company.name}</h1>
              <div className="text-xl text-neutral-800 font-semibold mb-4">{company.slogan}</div>
              <span className="tag tag-primary">
                {data.categories.find(c => c.id === company.category)?.name || 
                 companies.find(c => c.id === company.id)?.category}
              </span>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2>О компании</h2>
            <p>{company.description}</p>

            <h2>Преимущества</h2>
            <ul>
              {company.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>

            {company.bonus && (
              <>
                <h2>Бонусное предложение</h2>
                <p>{company.bonus}</p>
              </>
            )}

            <div className="mt-12 text-center">
              <a
                href={company.contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg hover-glow"
              >
                {company.contactCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 