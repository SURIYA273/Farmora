import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  description: string;
  link: string;
  date: string;
}

export function FarmerNews() {
  const [news, setNews] = useState<NewsItem[]>([
    {
      title: "New Government Scheme for Organic Farming",
      description: "The Ministry of Agriculture announces new subsidies for organic farming certification.",
      link: "https://agricoop.gov.in/",
      date: new Date().toLocaleDateString()
    },
    {
      title: "Weather Alert: Monsoon Update",
      description: "IMD predicts early monsoon arrival in several agricultural regions.",
      link: "https://mausam.imd.gov.in/",
      date: new Date().toLocaleDateString()
    },
    {
      title: "Market Prices: Rice and Wheat Show Strong Growth",
      description: "Current market trends show increasing prices for major crops.",
      link: "https://agmarknet.gov.in/",
      date: new Date().toLocaleDateString()
    }
  ]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Newspaper className="h-6 w-6 text-green-500 mr-2" />
          Daily Agricultural Updates
        </h2>
      </div>
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-lg text-gray-900">{item.title}</h3>
              <span className="text-sm text-gray-500">{item.date}</span>
            </div>
            <p className="text-gray-600 mt-1">{item.description}</p>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 text-sm mt-2 flex items-center"
            >
              Read more <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}