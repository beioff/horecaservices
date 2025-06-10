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

const OFFERS_FILE = path.join(__dirname, '../../public/data/offers.json');

export async function addOffer(offer: Offer): Promise<void> {
  try {
    console.log('Adding new offer:', offer);
    
    // Read current offers file
    const content = await fs.readFile(OFFERS_FILE, 'utf-8');
    const data = JSON.parse(content);
    
    // Add new offer
    data.companies.push(offer);
    
    // Write back to file
    await fs.writeFile(OFFERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('File written successfully');
  } catch (error) {
    console.error('Error adding offer:', error);
    throw error;
  }
}

export async function deleteOffer(offerId: string): Promise<void> {
  try {
    // Read current offers file
    const content = await fs.readFile(OFFERS_FILE, 'utf-8');
    const data = JSON.parse(content);
    
    // Remove the offer with matching id
    data.companies = data.companies.filter((company: Offer) => company.id !== offerId);
    
    // Write back to file
    await fs.writeFile(OFFERS_FILE, JSON.stringify(data, null, 2), 'utf-8');

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
    // Read current offers file
    const content = await fs.readFile(OFFERS_FILE, 'utf-8');
    const data = JSON.parse(content);
    
    // Find and update the offer
    const offerIndex = data.companies.findIndex((company: Offer) => company.id === offerId);
    if (offerIndex === -1) {
      throw new Error(`Offer with id ${offerId} not found`);
    }
    
    data.companies[offerIndex] = { ...data.companies[offerIndex], ...updatedOffer };
    
    // Write back to file
    await fs.writeFile(OFFERS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error updating offer:', error);
    throw error;
  }
} 