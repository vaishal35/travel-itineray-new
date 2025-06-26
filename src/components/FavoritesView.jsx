
import { Trash2, Heart, Star, MapPin } from 'lucide-react';

const FavoritesView = ({ favorites, removeFromFavorites }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="bg-gradient-to-r from-pink-50 to-red-50 px-6 py-5 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl">
          <Heart size={24} className="text-pink-600" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Your Favorites</h2>
          <p className="text-gray-600 mt-1">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>
    </div>

    <div className="p-6">
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart size={32} className="text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600">
            Add some items from your itinerary to see them here!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-lg">
                  {item.type === 'restaurant' ? (
                    <Star size={16} className="text-pink-600" />
                  ) : (
                    <MapPin size={16} className="text-pink-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <span className="capitalize bg-gray-200 px-2 py-1 rounded text-xs font-medium">
                      {item.type}
                    </span>
                    {item.price && (
                      <>
                        <span>•</span>
                        <span className="font-medium">{item.price}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeFromFavorites(item.id, item.type)}
                className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default FavoritesView;
