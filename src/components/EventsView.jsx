// src/components/EventsView.jsx
import React from 'react';
import { Heart } from 'lucide-react';

const EventsView = ({ localEvents, addToFavorites }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Local Events</h2>
    <div className="space-y-4">
      {localEvents.map((event) => (
        <div key={event.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-800">{event.name}</h3>
            <p className="text-sm text-gray-600">
              {event.type} • {new Date(event.date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="font-medium text-gray-800">{event.price}</div>
            <button
              onClick={() => addToFavorites(event)}
              className="text-gray-400 hover:text-red-500 transition-colors mt-1"
            >
              <Heart size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EventsView;
