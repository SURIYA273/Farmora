import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, CloudRain, TrendingUp } from 'lucide-react';

const yieldData = [
  { month: 'Jan', rice: 450, wheat: 300, tomato: 200 },
  { month: 'Feb', rice: 470, wheat: 320, tomato: 220 },
  { month: 'Mar', rice: 460, wheat: 310, tomato: 210 },
  { month: 'Apr', rice: 480, wheat: 330, tomato: 230 },
  { month: 'May', rice: 490, wheat: 340, tomato: 240 },
];

const weatherData = [
  { day: '1', temperature: 25, rainfall: 10 },
  { day: '2', temperature: 27, rainfall: 5 },
  { day: '3', temperature: 26, rainfall: 15 },
  { day: '4', temperature: 28, rainfall: 8 },
  { day: '5', temperature: 24, rainfall: 20 },
];

const marketData = [
  { month: 'Jan', rice: 2500, wheat: 2200, tomato: 40 },
  { month: 'Feb', rice: 2550, wheat: 2250, tomato: 45 },
  { month: 'Mar', rice: 2600, wheat: 2300, tomato: 42 },
  { month: 'Apr', rice: 2650, wheat: 2350, tomato: 48 },
  { month: 'May', rice: 2700, wheat: 2400, tomato: 50 },
];

export function Analytics() {
  const [searchParams] = useSearchParams();
  const [activeType, setActiveType] = useState('yields');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setActiveType(type);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Analytics & Insights</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setActiveType('yields')}
            className={`p-6 rounded-lg shadow transition flex items-center ${
              activeType === 'yields' ? 'bg-purple-50 border-2 border-purple-500' : 'bg-white hover:shadow-lg'
            }`}
          >
            <BarChart3 className="h-6 w-6 text-purple-500 mr-3" />
            <div className="text-left">
              <h3 className="font-semibold">Crop Yields</h3>
              <p className="text-sm text-gray-600">Track harvest performance</p>
            </div>
          </button>

          <button
            onClick={() => setActiveType('weather')}
            className={`p-6 rounded-lg shadow transition flex items-center ${
              activeType === 'weather' ? 'bg-purple-50 border-2 border-purple-500' : 'bg-white hover:shadow-lg'
            }`}
          >
            <CloudRain className="h-6 w-6 text-purple-500 mr-3" />
            <div className="text-left">
              <h3 className="font-semibold">Weather Patterns</h3>
              <p className="text-sm text-gray-600">Analyze weather trends</p>
            </div>
          </button>

          <button
            onClick={() => setActiveType('market')}
            className={`p-6 rounded-lg shadow transition flex items-center ${
              activeType === 'market' ? 'bg-purple-50 border-2 border-purple-500' : 'bg-white hover:shadow-lg'
            }`}
          >
            <TrendingUp className="h-6 w-6 text-purple-500 mr-3" />
            <div className="text-left">
              <h3 className="font-semibold">Market Trends</h3>
              <p className="text-sm text-gray-600">Monitor price changes</p>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeType === 'yields' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Crop Yields Over Time</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yieldData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rice" fill="#22c55e" name="Rice" />
                    <Bar dataKey="wheat" fill="#eab308" name="Wheat" />
                    <Bar dataKey="tomato" fill="#ef4444" name="Tomato" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeType === 'weather' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Weather Patterns</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weatherData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature (°C)" />
                    <Line yAxisId="right" type="monotone" dataKey="rainfall" stroke="#3b82f6" name="Rainfall (mm)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeType === 'market' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Market Price Trends</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rice" stroke="#22c55e" name="Rice (₹/q)" />
                    <Line type="monotone" dataKey="wheat" stroke="#eab308" name="Wheat (₹/q)" />
                    <Line type="monotone" dataKey="tomato" stroke="#ef4444" name="Tomato (₹/kg)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}