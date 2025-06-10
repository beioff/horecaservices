import { companies } from '@/companies';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return companies.map((company) => ({
    id: company.id,
  }));
}

export default function CompanyPage({ params }: { params: { id: string } }) {
  const company = companies.find((c) => c.id === params.id);

  if (!company) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{company.name}</h1>
      <p className="text-xl text-gray-600 mb-4">{company.slogan}</p>
      <p className="mb-4">{company.description}</p>
      <h2 className="text-2xl font-semibold mb-2">Преимущества:</h2>
      <ul className="list-disc pl-5 mb-4">
        {company.benefits.map((benefit, index) => (
          <li key={index}>{benefit}</li>
        ))}
      </ul>
      {company.bonus && (
        <div className="bg-yellow-100 p-4 rounded-lg mb-4">
          <p className="font-semibold">Бонус: {company.bonus}</p>
        </div>
      )}
      <a
        href={company.contactUrl}
        className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        {company.contactCta}
      </a>
    </div>
  );
} 