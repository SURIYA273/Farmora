import React from 'react';
import { useTranslation } from 'react-i18next';

export function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">About Us</h1>

        {/* Hero Image */}
        <div className="flex justify-center mb-8">
          <img
            src="https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg"
            alt="Smart Farming"
            className="rounded-lg shadow-lg mb-6 w-full max-w-3xl"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p>
            Farmora is a **smart farming platform** that helps farmers track
            crops, monitor resources, and make data-driven decisions. Our
            mission is to **empower farmers with technology** for better
            productivity and sustainability.
          </p>
          <p className="mt-4">
            At **Farmora**, we bridge the gap between traditional farming and
            modern agricultural innovations. With real-time data, AI-driven
            insights, and smart analytics, we help farmers **maximize yield**
            while **minimizing waste**.
          </p>

          <h2 className="text-2xl font-semibold mt-6">
            🌿 Why Choose Farmora?
          </h2>

          {/* Features Section with Images */}
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="font-semibold">📊 Smart Analytics</h3>
              <p>Get insights on weather, soil, and crop health.</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="font-semibold">🚜 Resource Tracking</h3>
              <p>Monitor water usage & optimize fertilizers.</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="font-semibold">💡 AI-Powered Guidance</h3>
              <p>Get personalized farming suggestions.</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <h3 className="font-semibold">📡 IoT Integration</h3>
              <p>Automate farm management with smart sensors.</p>
            </div>
          </div>

          <p className="mt-6 font-semibold text-center">
            Farming is more than just growing crops—it’s about **sustaining
            lives, preserving nature, and embracing innovation**. Join us at
            **Farmora**, and let's grow together! 🌾🚀
          </p>
        </div>
      </div>
    </div>
  );
}
