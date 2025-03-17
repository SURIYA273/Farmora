import React, { useEffect, useState } from 'react';
import { Cloud, Sun, Droplets, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
}

export function WeatherWidget() {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=11.12&lon=78.65&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Could not load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather data every 5 minutes
    const interval = setInterval(fetchWeather, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Sun className="h-6 w-6 text-yellow-500 mr-2" />
          {t('weather.title')}
        </h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Sun className="h-6 w-6 text-yellow-500 mr-2" />
          {t('weather.title')}
        </h3>
        <p className="text-red-500">{error || 'Weather data unavailable'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Sun className="h-6 w-6 text-yellow-500 mr-2" />
        {t('weather.title')}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <Cloud className="h-5 w-5 text-gray-600 mr-2" />
          <span>{Math.round(weather.main.temp)}°C</span>
        </div>
        <div className="flex items-center">
          <Droplets className="h-5 w-5 text-blue-500 mr-2" />
          <span>{weather.main.humidity}%</span>
        </div>
        <div className="flex items-center">
          <Wind className="h-5 w-5 text-gray-600 mr-2" />
          <span>{Math.round(weather.wind.speed * 3.6)} km/h</span>
        </div>
        <div className="flex items-center">
          <Sun className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="capitalize">{weather.weather[0].description}</span>
        </div>
      </div>
    </div>
  );
}