import { companies, categories } from '@/companies';
import { notFound } from 'next/navigation';
import CompanyPageClient from './CompanyPageClient';

export function generateStaticParams() {
  return companies.map((company) => ({
    id: company.id,
  }));
}

export default function CompanyPage({ params }: { params: { id: string } }) {
  const company = companies.find(c => c.id === params.id);
  const category = categories.find(c => c.id === company?.category);

  if (!company) {
    notFound();
  }

  return <CompanyPageClient company={company} category={category} />;
} 