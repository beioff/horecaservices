import { useState } from 'react';
import { companies, categories } from '@/companies';
import Link from 'next/link';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCompanies = selectedCategory
    ? companies.filter((company) => company.category === selectedCategory)
    : companies;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Каталог компаний для HoReCa</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Категории:</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded ${
              selectedCategory === null
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            Все
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map((company) => (
          <Link href={`/companies/${company.id}`} key={company.id}>
            <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold">{company.name}</h2>
              <p className="text-gray-600">{company.slogan}</p>
              <p className="mt-2">{company.shortDescription}</p>
              <div className="mt-4">
                <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  {company.contactCta}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
