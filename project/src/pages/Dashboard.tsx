import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Leaf, Sun, CloudRain, Wind, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { WeatherWidget } from '../components/WeatherWidget';
import { MarketPrices } from '../components/MarketPrices';
import { GrowthAnalysis } from '../components/GrowthAnalysis';
import { FarmerNews } from '../components/FarmerNews';
import { DiseaseDetection } from '../components/DiseaseDetection';

interface UserData {
  username: string;
  farm_size: string;
  location: string;
}

interface FarmStats {
  totalCrops: number;
  activeGrowth: number;
  pendingHarvest: number;
}

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [farmStats, setFarmStats] = useState<FarmStats>({
    totalCrops: 0,
    activeGrowth: 0,
    pendingHarvest: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/');
          return;
        }

        // Fetch user data from Supabase
        const { data: farms } = await supabase
          .from('farms')
          .select('*')
          .eq('user_id', session.user.id);

        if (farms && farms.length > 0) {
          const { data: crops } = await supabase
            .from('crops')
            .select('*')
            .eq('farm_id', farms[0].id);

          setFarmStats({
            totalCrops: crops?.length || 0,
            activeGrowth: crops?.filter(c => c.status === 'growing').length || 0,
            pendingHarvest: crops?.filter(c => c.status === 'ready_for_harvest').length || 0,
          });
        }

        setUserData({
          username: session.user.user_metadata.username || 'Farmer',
          farm_size: session.user.user_metadata.farm_size || '0',
          location: session.user.user_metadata.location || 'Unknown',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back, {userData.username}!
              </h1>
              <p className="text-gray-600">
                Farm Size: {userData.farm_size} hectares | Location: {userData.location}
              </p>
            </div>
            <Leaf className="h-12 w-12 text-green-500" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Crops</p>
                <h2 className="text-3xl font-bold text-gray-800">{farmStats.totalCrops}</h2>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Active Growth</p>
                <h2 className="text-3xl font-bold text-gray-800">{farmStats.activeGrowth}</h2>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Pending Harvest</p>
                <h2 className="text-3xl font-bold text-gray-800">{farmStats.pendingHarvest}</h2>
              </div>
              <Users className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Disease Detection */}
        <div className="mb-8">
          <DiseaseDetection />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weather and Market Data */}
          <div className="space-y-8">
            <WeatherWidget />
            <MarketPrices />
          </div>

          {/* Growth Analysis and News */}
          <div className="lg:col-span-2 space-y-8">
            <GrowthAnalysis />
            <FarmerNews />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/crop-management')}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2 touch-manipulation"
          >
            <Leaf className="h-5 w-5 text-green-500" />
            <span>Manage Crops</span>
          </button>

          <button
            onClick={() => navigate('/team-collaboration')}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2 touch-manipulation"
          >
            <Users className="h-5 w-5 text-blue-500" />
            <span>Team Tasks</span>
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2 touch-manipulation"
          >
            <BarChart3 className="h-5 w-5 text-purple-500" />
            <span>View Analytics</span>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-center space-x-2 touch-manipulation"
          >
            <Users className="h-5 w-5 text-gray-500" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}