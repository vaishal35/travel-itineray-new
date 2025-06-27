
import React from 'react';
import { Heart, Clock, MapPin, DollarSign, Edit3 } from 'lucide-react';

const ItineraryView = ({ tripData, itinerary, addToFavorites, setShowForm }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            {tripData.destination} Itinerary
          </h2>
          <p className="text-gray-600 flex items-center">
            <MapPin size={16} className="mr-1" />
            {itinerary.length} days planned
          </p>
        </div>
      </div>
    </div>

    {itinerary.map((day) => (
      <div key={day.day} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Day {day.day}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-600 font-semibold">
                <DollarSign size={18} />
                <span className="text-lg">{day.estimatedCost}</span>
              </div>
              <p className="text-xs text-gray-500">estimated cost</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {day.activities.map((activity, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                    <Clock size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {activity.time}
                      </span>
                      <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span className="capitalize">
                        {activity.type === 'restaurant' ? activity.cuisine : activity.type}
                      </span>
                      {activity.price && (
                        <>
                          <span>•</span>
                          <span className="font-medium">{activity.price}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => addToFavorites(activity)}
                  className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Heart size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ItineraryView;
