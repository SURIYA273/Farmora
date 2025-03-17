import React from 'react';

export function Features() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Key Features</h1>
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          
          <div className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">🌦️ Real-Time Weather Updates</h2>
            <p className="text-gray-600">Stay informed about current weather conditions and forecasts to make better farming decisions.</p>
          </div>

          <div className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">🌾 Crop Management</h2>
            <p className="text-gray-600">Track crop growth, manage planting schedules, and get insights on best practices for different crops.</p>
          </div>

          <div className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">📊 Market Predictions</h2>
            <p className="text-gray-600">Analyze market trends and price forecasts to maximize profit from your farm produce.</p>
          </div>

          <div className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">🚜 Smart Irrigation</h2>
            <p className="text-gray-600">Optimize water usage with AI-driven irrigation recommendations to enhance efficiency and reduce waste.</p>
          </div>

          <div className="border p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">📅 Task Scheduling</h2>
            <p className="text-gray-600">Assign tasks to workers, track progress, and manage daily operations seamlessly.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
