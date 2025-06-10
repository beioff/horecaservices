import { categories } from '@/companies';

async function getCompanies() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies`, {
    cache: 'no-store',
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch companies');
  }
  
  return res.json();
}

export default async function CompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Компании-партнеры</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company: any) => (
          <div key={company.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <img
                src={company.logo}
                alt={company.name}
                className="w-16 h-16 object-contain mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">{company.name}</h2>
                <p className="text-gray-600">{company.slogan}</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{company.shortDescription}</p>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Преимущества:</h3>
              <ul className="list-disc list-inside">
                {company.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="text-gray-600">{benefit}</li>
                ))}
              </ul>
            </div>
            
            {company.bonus && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
                <p className="text-yellow-800">{company.bonus}</p>
              </div>
            )}
            
            <a
              href={company.contactUrl}
              className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {company.contactCta}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
} 