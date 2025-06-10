import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { companies } from '../companies';

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
  companyId: string;
}

export async function addOffer(offer: Offer): Promise<void> {
  // Add the new offer to the companies array
  companies.push(offer);

  // Update the companies.ts file
  const filePath = path.join(__dirname, '..', 'companies.ts');
  const fileContent = await fs.readFile(filePath, 'utf-8');

  // Find the companies array in the file
  const companiesArrayStart = fileContent.indexOf('export const companies = [');
  const companiesArrayEnd = fileContent.lastIndexOf('];');

  if (companiesArrayStart === -1 || companiesArrayEnd === -1) {
    throw new Error('Could not find companies array in the file');
  }

  // Create the new offer string
  const newOfferString = `  ${JSON.stringify(offer, null, 2)},\n`;

  // Insert the new offer before the closing bracket
  const newContent = 
    fileContent.slice(0, companiesArrayEnd) + 
    newOfferString + 
    fileContent.slice(companiesArrayEnd);

  // Write the updated content back to the file
  await fs.writeFile(filePath, newContent, 'utf-8');
}

export async function deleteOffer(offerId: string): Promise<void> {
  // Find the offer in the companies array
  const offerIndex = companies.findIndex(offer => offer.id === offerId);
  
  if (offerIndex === -1) {
    throw new Error(`Offer with ID ${offerId} not found`);
  }

  // Remove the offer from the array
  companies.splice(offerIndex, 1);

  // Update the companies.ts file
  const filePath = path.join(__dirname, '..', 'companies.ts');
  const fileContent = await fs.readFile(filePath, 'utf-8');

  // Find the companies array in the file
  const companiesArrayStart = fileContent.indexOf('export const companies = [');
  const companiesArrayEnd = fileContent.lastIndexOf('];');

  if (companiesArrayStart === -1 || companiesArrayEnd === -1) {
    throw new Error('Could not find companies array in the file');
  }

  // Create the new companies array string
  const newCompaniesString = companies
    .map(company => `  ${JSON.stringify(company, null, 2)}`)
    .join(',\n');

  // Replace the entire companies array
  const newContent = 
    fileContent.slice(0, companiesArrayStart) +
    'export const companies = [\n' +
    newCompaniesString +
    '\n];' +
    fileContent.slice(companiesArrayEnd + 2);

  // Write the updated content back to the file
  await fs.writeFile(filePath, newContent, 'utf-8');
}

export async function getOffers(): Promise<Offer[]> {
  return companies;
} 