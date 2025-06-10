import { companies } from '@/companies';
import CompanyPageClient from './CompanyPageClient.tsx';

export function generateStaticParams() {
  return companies.map((company) => ({
    id: company.id,
  }));
}

export default function CompanyPage({ params }: { params: { id: string } }) {
  return <CompanyPageClient params={params} />;
} 