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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadMarketPrices = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const data = await fetchMarketPrices();
      setPrices(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading market prices:', err);
      setError('Could not load market prices. Please try again later.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadMarketPrices();
    // Refresh prices every 5 minutes
    const interval = setInterval(() => loadMarketPrices(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number, unit: string) => {
    return `₹${price}/${unit}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-6">{t('market.title')}</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">{t('market.title')}</h3>
        <button 
          onClick={() => loadMarketPrices(true)}
          className={`text-gray-600 hover:text-gray-900 transition ${isRefreshing ? 'animate-spin' : ''}`}
          disabled={isRefreshing}
          title="Refresh prices"
        >
          <RefreshCcw className="h-5 w-5" />
        </button>
      </div>

      {error ? (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg mb-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      {prices.length === 0 && !error ? (
        <p className="text-gray-500 text-center py-4">No market prices available</p>
      ) : (
        <div className="space-y-4">
          {prices.map((item, index) => (
            <div 
              key={`${item.crop_name}-${item.market_location}-${index}`} 
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div>
                <span className="font-medium">{item.crop_name}</span>
                <p className="text-sm text-gray-600">{item.market_location}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">{formatPrice(item.price_per_unit, item.unit)}</span>
                {item.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : item.trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-gray-200" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {lastUpdated && (
        <p className="text-sm text-gray-500 mt-4">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}