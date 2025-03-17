import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCcw, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MarketPrice, fetchMarketPrices } from '../services/marketPrices';

export function MarketPrices() {
  const { t } = useTranslation();
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadMarketPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchMarketPrices();
      setPrices(data.slice(0, 4)); // Show only top 4 prices
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading market prices:', err);
      setError('Could not load market prices');
      // Fallback data in case of error
      setPrices([
        { crop_name: 'Rice', price_per_unit: 2500, unit: 'quintal', trend: 'up', market_location: 'Chennai', recorded_at: new Date().toISOString() },
        { crop_name: 'Wheat', price_per_unit: 2200, unit: 'quintal', trend: 'down', market_location: 'Delhi', recorded_at: new Date().toISOString() },
        { crop_name: 'Tomato', price_per_unit: 40, unit: 'kg', trend: 'up', market_location: 'Bangalore', recorded_at: new Date().toISOString() },
        { crop_name: 'Potato', price_per_unit: 25, unit: 'kg', trend: 'down', market_location: 'Kolkata', recorded_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketPrices();
    // Refresh prices every 5 minutes
    const interval = setInterval(loadMarketPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, unit: string) => {
    return `₹${price}/${unit}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">{t('market.title')}</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{t('market.title')}</h3>
        <button 
          onClick={loadMarketPrices}
          className="text-gray-600 hover:text-gray-900 transition"
          title="Refresh prices"
        >
          <RefreshCcw className="h-5 w-5" />
        </button>
      </div>

      {error ? (
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      ) : null}

      <div className="space-y-4">
        {prices.map((item) => (
          <div key={`${item.crop_name}-${item.market_location}`} className="flex items-center justify-between border-b pb-2 last:border-0">
            <div>
              <span className="font-medium">{item.crop_name}</span>
              <p className="text-sm text-gray-600">{item.market_location}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium">{formatPrice(item.price_per_unit, item.unit)}</span>
              {item.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {lastUpdated && (
        <p className="text-sm text-gray-500 mt-4">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}