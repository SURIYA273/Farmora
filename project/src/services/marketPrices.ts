const API_KEY = import.meta.env.VITE_MARKET_PRICE_API_KEY;
const API_BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

export interface MarketPrice {
  crop_name: string;
  price_per_unit: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  market_location: string;
  recorded_at: string;
}

export async function fetchMarketPrices(): Promise<MarketPrice[]> {
  try {
    const response = await fetch(`${API_BASE_URL}?api-key=${API_KEY}&format=json`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch market prices');
    }

    const data = await response.json();
    
    // Transform the API response to match our interface
    return data.records.map((record: any) => ({
      crop_name: record.commodity,
      price_per_unit: parseFloat(record.modal_price),
      unit: 'quintal',
      trend: determinePriceTrend(record.modal_price, record.min_price),
      market_location: record.market,
      recorded_at: record.arrival_date
    }));
  } catch (error) {
    console.error('Error fetching market prices:', error);
    throw error;
  }
}

function determinePriceTrend(currentPrice: number, previousPrice: number): 'up' | 'down' | 'stable' {
  if (currentPrice > previousPrice) return 'up';
  if (currentPrice < previousPrice) return 'down';
  return 'stable';
}