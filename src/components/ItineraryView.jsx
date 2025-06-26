// src/components/ItineraryView.jsx
import React from 'react';
import { Heart } from 'lucide-react';

const ItineraryView = ({ tripData, itinerary, addToFavorites, setShowForm }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">
        {tripData.destination} Itinerary
      </h2>
      <button
        onClick={() => setShowForm(true)}
        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        Edit Trip
      </button>
    </div>

    {itinerary.map((day) => (
      <div key={day.day} className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Day {day.day} - {new Date(day.date).toLocaleDateString()}
          </h3>
          <span className="text-lg font-medium text-green-600">
            ~${day.estimatedCost}
          </span>
        </div>

        <div className="space-y-4">
          {day.activities.map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-500 w-20">
                  {activity.time}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{activity.name}</h4>
                  <p className="text-sm text-gray-600">
                    {activity.type === 'restaurant' ? activity.cuisine : activity.type} 
                    {activity.price && ` • ${activity.price}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => addToFavorites(activity)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Heart size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default ItineraryView;
