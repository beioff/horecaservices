import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Offer {
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

const COMPANIES_FILE = path.join(__dirname, '../../src/companies.ts');

export async function addOffer(offer: Offer): Promise<void> {
  try {
    // Read current companies file
    const content = await fs.readFile(COMPANIES_FILE, 'utf-8');
    
    // Find the companies array
    const companiesMatch = content.match(/export const companies = \[([\s\S]*?)\];/);
    if (!companiesMatch) {
      throw new Error('Could not find companies array in file');
    }

    // Create new company entry
    const newCompany = `  {
    id: '${offer.id}',
    name: '${offer.name}',
    logo: '${offer.logo}',
    category: '${offer.category}',
    slogan: '${offer.slogan}',
    shortDescription: '${offer.shortDescription}',
    description: '${offer.description}',
    benefits: [
      ${offer.benefits.map(b => `'${b}'`).join(',\n      ')}
    ],
    bonus: '${offer.bonus}',
    contactCta: '${offer.contactCta}',
    contactUrl: '${offer.contactUrl}',
  },`;

    // Insert new company before the closing bracket
    const newContent = content.replace(
      /export const companies = \[([\s\S]*?)\];/,
      `export const companies = [${newCompany}$1];`
    );

    // Write back to file
    await fs.writeFile(COMPANIES_FILE, newContent, 'utf-8');
  } catch (error) {
    console.error('Error adding offer:', error);
    throw error;
  }
}

export async function deleteOffer(offerId: string): Promise<void> {
  try {
    // Read current companies file
    const content = await fs.readFile(COMPANIES_FILE, 'utf-8');
    
    // Find the companies array
    const companiesMatch = content.match(/export const companies = \[([\s\S]*?)\];/);
    if (!companiesMatch) {
      throw new Error('Could not find companies array in file');
    }

    // Remove the company with matching id
    const companiesContent = companiesMatch[1];
    const companyRegex = new RegExp(`\\s*{[^}]*id:\\s*'${offerId}'[^}]*},?\\n?`, 'g');
    const newCompaniesContent = companiesContent.replace(companyRegex, '');

    // Create new content
    const newContent = content.replace(
      /export const companies = \[([\s\S]*?)\];/,
      `export const companies = [${newCompaniesContent}];`
    );

    // Write back to file
    await fs.writeFile(COMPANIES_FILE, newContent, 'utf-8');

    // Delete logo file if it exists
    const logoPath = path.join(__dirname, '../../public/logos', `${offerId}.png`);
    try {
      await fs.unlink(logoPath);
    } catch (error) {
      // Ignore error if file doesn't exist
    }
  } catch (error) {
    console.error('Error deleting offer:', error);
    throw error;
  }
}

export async function updateOffer(offerId: string, updatedOffer: Partial<Offer>): Promise<void> {
  try {
    // Read current companies file
    const content = await fs.readFile(COMPANIES_FILE, 'utf-8');
    
    // Find the companies array
    const companiesMatch = content.match(/export const companies = \[([\s\S]*?)\];/);
    if (!companiesMatch) {
      throw new Error('Could not find companies array in file');
    }

    // Find the company with matching id
    const companiesContent = companiesMatch[1];
    const companyRegex = new RegExp(`(\\s*{[^}]*id:\\s*'${offerId}'[^}]*},?\\n?)`, 'g');
    const companyMatch = companyRegex.exec(companiesContent);

    if (!companyMatch) {
      throw new Error(`Company with id ${offerId} not found`);
    }

    // Parse the existing company
    const existingCompany = companyMatch[1];
    const companyProps = existingCompany.match(/(\w+):\s*'([^']*)'/g) || [];
    const company: Record<string, string> = {};
    
    companyProps.forEach(prop => {
      const [key, value] = prop.split(':').map(s => s.trim());
      company[key] = value.replace(/^'|'$/g, '');
    });

    // Update the company properties
    const updatedCompany = { ...company, ...updatedOffer };

    // Create new company entry
    const newCompany = `  {
    id: '${updatedCompany.id}',
    name: '${updatedCompany.name}',
    logo: '${updatedCompany.logo}',
    category: '${updatedCompany.category}',
    slogan: '${updatedCompany.slogan}',
    shortDescription: '${updatedCompany.shortDescription}',
    description: '${updatedCompany.description}',
    benefits: [
      ${(updatedCompany.benefits as string[]).map(b => `'${b}'`).join(',\n      ')}
    ],
    bonus: '${updatedCompany.bonus}',
    contactCta: '${updatedCompany.contactCta}',
    contactUrl: '${updatedCompany.contactUrl}',
  },`;

    // Replace the old company with the updated one
    const newCompaniesContent = companiesContent.replace(companyRegex, newCompany);

    // Create new content
    const newContent = content.replace(
      /export const companies = \[([\s\S]*?)\];/,
      `export const companies = [${newCompaniesContent}];`
    );

    // Write back to file
    await fs.writeFile(COMPANIES_FILE, newContent, 'utf-8');
  } catch (error) {
    console.error('Error updating offer:', error);
    throw error;
  }
} 