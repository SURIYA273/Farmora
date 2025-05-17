import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane as Plant, Users, BarChart3, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SearchBar } from '../components/SearchBar';
import { WeatherWidget } from '../components/WeatherWidget';
import { MarketPrices } from '../components/MarketPrices';
import { GrowthAnalysis } from '../components/GrowthAnalysis';
import { FarmMap } from '../components/FarmMap';
import { supabase } from '../lib/supabase';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function FeatureCard({ icon, title, description, onClick }: FeatureCardProps) {
  return (
    <div 
      className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGetStarted = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // If user is logged in, navigate to profile
      navigate('/profile');
    } else {
      // If user is not logged in, navigate to features page
      navigate('/signup');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <header className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80"
            alt="Sustainable farming" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 h-[calc(100vh-5rem)] flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              {t('hero.description')}
            </p>
            <div className="space-y-4">
              <SearchBar />
              <button
                onClick={handleGetStarted}
                className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition flex items-center"
              >
                {t('hero.button')} <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FarmMap />
            </div>
            <div>
              <WeatherWidget />
            </div>
            <div>
              <MarketPrices />
            </div>
            <div className="lg:col-span-2">
              <GrowthAnalysis />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">{t('features.title')}</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Plant className="h-8 w-8 text-green-500" />}
              title={t('features.crop.title')}
              description={t('features.crop.description')}
              onClick={() => navigate('/crop-management')}
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-green-500" />}
              title={t('features.team.title')}
              description={t('features.team.description')}
              onClick={() => navigate('/team-collaboration')}
            />
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-green-500" />}
              title={t('features.analytics.title')}
              description={t('features.analytics.description')}
              onClick={() => navigate('/analytics')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-green-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
          >
            {t('cta.button')}
          </button>
        </div>
      </section>
    </>
  );
}