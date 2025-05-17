import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plane as Plant } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function GrowthAnalysis() {
  const { t } = useTranslation();

  const data = [
    { day: '1', growth: 2 },
    { day: '5', growth: 4 },
    { day: '10', growth: 8 },
    { day: '15', growth: 12 },
    { day: '20', growth: 15 },
    { day: '25', growth: 18 },
    { day: '30', growth: 20 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Plant className="h-6 w-6 text-green-500 mr-2" />
        {t('growth.title')}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="growth" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}