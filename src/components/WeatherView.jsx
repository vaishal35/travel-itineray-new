// src/components/WeatherView.jsx
import React from 'react';

const WeatherView = ({ weather }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Weather Forecast</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {weather.map((day, idx) => (
        <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-2">{day.icon}</div>
          <div className="font-medium text-gray-800">
            {new Date(day.date).toLocaleDateString()}
          </div>
          <div className="text-2xl font-bold text-gray-900 my-2">{day.temp}</div>
          <div className="text-sm text-gray-600">{day.condition}</div>
        </div>
      ))}
    </div>
  </div>
);

export default WeatherView;
