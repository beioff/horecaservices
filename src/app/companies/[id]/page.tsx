import { companies } from '@/companies';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

export function generateStaticParams() {
  return companies.map((company) => ({
    id: company.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const company = companies.find((c) => c.id === params.id);

  if (!company) {
    return {
      title: 'Компания не найдена',
      description: 'Запрашиваемая компания не найдена в каталоге.',
    };
  }

  return {
    title: `${company.name} — ${company.slogan} | HoReCa B2B`,
    description: company.description,
    openGraph: {
      title: `${company.name} — ${company.slogan}`,
      description: company.description,
      type: 'article',
      locale: 'ru_RU',
      siteName: 'HoReCa B2B',
    },
  };
}

export default function CompanyPage({ params }: { params: { id: string } }) {
  const company = companies.find((c) => c.id === params.id);

  if (!company) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-dark to-dark/90 text-white py-20">
        <div className="container mx-auto px-4">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к каталогу
          </Link>
          <div className="flex items-center mb-6">
            <img
              src={company.logo}
              alt={company.name}
              className="w-20 h-20 object-contain mr-6 bg-white rounded-xl p-2"
            />
            <div>
              <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
              <p className="text-xl text-gray-300">{company.slogan}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">О компании</h2>
              <p className="text-gray-700 leading-relaxed">{company.description}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-bold mb-6">Преимущества</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 bg-secondary rounded-xl"
                  >
                    <svg
                      className="w-6 h-6 text-primary mr-3 mt-1"
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
                    <span className="text-dark">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-8 sticky top-8">
              {company.bonus && (
                <div className="bg-primary/10 text-primary rounded-xl p-6 mb-6">
                  <h3 className="font-bold text-lg mb-2">Специальное предложение</h3>
                  <p>{company.bonus}</p>
                </div>
              )}
              <a
                href={company.contactUrl}
                className="btn btn-primary w-full text-center"
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