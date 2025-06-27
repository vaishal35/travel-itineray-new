import React, { useState } from 'react';
import { Loader, Search, Star, Wifi, Coffee, Hotel } from 'lucide-react';

export default function HotelSearch({ tripData, setTripData, getAmadeusToken }) {
  const [hotelOptions, setHotelOptions] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [showHotelOptions, setShowHotelOptions] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const calculateNights = () => {
    if (!tripData.startDate || !tripData.endDate) return 1;
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const getCityCode = async (cityName, token) => {
    // Extract what's inside the parentheses, e.g. "NYC" from "NEW YORK (NYC)"
    const match = cityName.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      return match[1].trim();  // Return just the code inside parentheses
    }
  
    // If no parentheses found, fallback to your existing logic
  
    // Clean city name without parentheses
    const cityMatch = cityName.match(/^([^(]+)/);
    const cleanCityName = cityMatch ? cityMatch[1].trim() : cityName;
  
    try {
      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${encodeURIComponent(cleanCityName)}&page[limit]=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await response.json();
  
      if (data.data?.[0]?.iataCode) {
        return data.data[0].iataCode;
      } else {
        console.warn('Amadeus city code lookup returned no results, falling back...');
      }
    } catch (error) {
      console.error('Error getting city code from Amadeus API:', error);
    }
  
    // Fallback mapping
    const cityToCityCode = {
      'New York': 'NYC',
      'Los Angeles': 'LAX',
      'Chicago': 'CHI',
      'Miami': 'MIA',
      'Orlando': 'ORL',
      'Tampa': 'TPA',
      'London': 'LON',
      'Paris': 'PAR',
      'Tokyo': 'TYO',
      'Indianapolis': 'IND',
      'Fort Wayne': 'FWA',
    };
  
    const fallbackCode = Object.entries(cityToCityCode).find(
      ([name]) => name.toLowerCase() === cleanCityName.toLowerCase()
    )?.[1];
  
    return fallbackCode || 'ORL'; // Default fallback to Orlando
  };
  

  const generateMockHotels = (adults) => {
    const nights = calculateNights();
    const basePrice = 120;
    return [
      {
        id: 1,
        hotelId: 'MOCK001',
        name: 'Grand Plaza Hotel',
        rating: 4,
        location: 'Downtown Orlando, FL',
        price: (basePrice * nights).toFixed(2),
        currency: 'USD',
        pricePerNight: basePrice.toFixed(2),
        amenities: ['WIFI', 'PARKING', 'POOL', 'FITNESS_CENTER'],
        description: 'Deluxe King Room with City View',
        adults,
        totalNights: nights,
        checkIn: tripData.startDate,
        checkOut: tripData.endDate
      }
    ];
  };

  const renderStarRating = (rating) => {
    if (rating === 'N/A') return <span className="text-gray-400">No rating</span>;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} size={16} className={i <= parseInt(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
      );
    }
    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  const renderAmenityIcon = (amenity) => {
    const map = {
      'WIFI': <Wifi size={16} className="text-blue-500" />,
      'PARKING': <Star size={16} className="text-green-500" />,
      'POOL': <div className="w-4 h-4 bg-blue-400 rounded-full" />,
      'FITNESS_CENTER': <div className="w-4 h-4 bg-red-400 rounded-sm" />,
      'SPA': <div className="w-4 h-4 bg-purple-400 rounded-full" />,
      'RESTAURANT': <Coffee size={16} className="text-orange-500" />,
      'BREAKFAST': <Coffee size={16} className="text-yellow-600" />,
      'ROOM_SERVICE': <Hotel size={16} className="text-gray-500" />
    };
    return map[amenity] || <div className="w-4 h-4 bg-gray-400 rounded-sm" />;
  };

  const selectAccommodation = (hotel) => {
    setSelectedHotel(hotel);
    setTripData({ ...tripData, selectedHotel: hotel, estimatedTravelCost: isNaN(parseFloat(hotel.price)) ? 0 : parseFloat(hotel.price) });
  };

  const searchHotels = async () => {
    if (!tripData.destination || !tripData.startDate || !tripData.endDate) {
      alert('Please fill in destination, check-in date, and check-out date');
      return;
    }

    const adults = tripData.passengers || 1;
    setLoadingHotels(true);
    setShowHotelOptions(true);

    try {
      const token = await getAmadeusToken(); // <-- Import this from your API utils
      const cityCode = await getCityCode(tripData.destination, token);
      const response = await fetch(
        `https://test.api.amadeus.com/v3/shopping/hotel-offers?cityCode=${cityCode}&checkInDate=${tripData.startDate}&checkOutDate=${tripData.endDate}&adults=${adults}&max=10&currency=USD`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();

      if (data.data?.length) {
        const hotels = data.data.map((hotelData, index) => {
          const hotel = hotelData.hotel;
          const offer = hotelData.offers?.[0] || {};
          return {
            id: index,
            hotelId: hotel.hotelId,
            name: hotel.name,
            rating: hotel.rating || 'N/A',
            location: `${hotel.address?.lines?.join(', ') || ''}${hotel.address?.cityName ? ', ' + hotel.address.cityName : ''}`,
            price: offer.price?.total || 'N/A',
            currency: offer.price?.currency || 'USD',
            pricePerNight: offer.price ? (parseFloat(offer.price.total) / calculateNights()).toFixed(2) : 'N/A',
            amenities: hotel.amenities || [],
            description: offer.room?.description || 'Standard Room',
            adults,
            totalNights: calculateNights(),
            checkIn: tripData.startDate,
            checkOut: tripData.endDate
          };
        });
        setHotelOptions(hotels);
      } else {
        setHotelOptions(generateMockHotels(adults));
      }
    } catch (err) {
      console.error('Hotel search failed:', err);
      setHotelOptions(generateMockHotels(adults));
    } finally {
      setLoadingHotels(false);
    }
  };

  if (tripData.accommodation !== 'hotels') return null;

  console.log({
    destination: tripData.destination,
    checkIn: tripData.startDate,
    checkOut: tripData.endDate,
    adults: tripData.passengers
  });
  
  return (
    <div className="mt-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Hotel Options</h3>
            {tripData.passengers > 1 && (
              <p className="text-sm text-gray-600 mt-1">For {tripData.passengers} guests</p>
            )}
          </div>
          <button
            onClick={searchHotels}
            disabled={loadingHotels}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loadingHotels ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
            <span className="font-medium">{loadingHotels ? 'Searching...' : 'Search Hotels'}</span>
          </button>
        </div>

        {showHotelOptions && (
          <div className="space-y-4">
            {loadingHotels ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader size={32} className="animate-spin text-blue-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Searching for hotels</h4>
                <p className="text-gray-600">Finding the best accommodations for your stay...</p>
              </div>
            ) : hotelOptions.length > 0 ? (
              hotelOptions.map((hotel) => (
                <div
                  key={hotel.hotelId}
                  onClick={() => selectAccommodation(hotel)}
                  className={`p-6 border rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedHotel?.hotelId === hotel.hotelId
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Hotel className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">{hotel.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{hotel.location}</p>
                          <div className="mb-3">{renderStarRating(hotel.rating)}</div>
                          <div className="flex flex-wrap gap-3">
                            {hotel.amenities?.slice(0, 4).map((amenity, i) => (
                              <div key={i} className="flex items-center space-x-2 text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                {renderAmenityIcon(amenity)}
                                <span className="capitalize">{amenity.toLowerCase().replace('_', ' ')}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{hotel.description}</p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-gray-900">${hotel.price}</div>
                      <div className="text-sm text-gray-600">{hotel.currency} total</div>
                      <div className="text-xs text-gray-500 mt-1">${hotel.pricePerNight}/night</div>
                      <div className="text-xs text-gray-500">{hotel.totalNights} night{hotel.totalNights > 1 ? 's' : ''}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Ready to search</h4>
                <p className="text-gray-600">Click "Search Hotels" to find available accommodations</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
