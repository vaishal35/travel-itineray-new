// src/components/FavoritesView.jsx
import React from 'react';
import { Trash2 } from 'lucide-react';

const FavoritesView = ({ favorites, removeFromFavorites }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Favorites</h2>
    {favorites.length === 0 ? (
      <p className="text-gray-500 text-center py-8">No favorites yet. Add some from your itinerary!</p>
    ) : (
      <div className="space-y-4">
        {favorites.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600">
                {item.type} {item.price && `• ${item.price}`}
              </p>
            </div>
            <button
              onClick={() => removeFromFavorites(item.id, item.type)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default FavoritesView;
