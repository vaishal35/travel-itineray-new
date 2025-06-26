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
    <div className="mt-4 p-4 bg-green-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Hotel Options
          {tripData.passengers > 1 && (
            <span className="text-sm font-normal text-gray-600 ml-2">(for {tripData.passengers} guests)</span>
          )}
        </h3>
        <button
          onClick={searchHotels}
          disabled={loadingHotels}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loadingHotels ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
          <span>{loadingHotels ? 'Searching...' : 'Search Hotels'}</span>
        </button>
      </div>

      {showHotelOptions && (
        <div className="space-y-3">
          {loadingHotels ? (
            <div className="text-center py-8">
              <Loader size={32} className="animate-spin mx-auto mb-4 text-green-600" />
              <p className="text-gray-600">Searching for hotels...</p>
            </div>
          ) : hotelOptions.length > 0 ? (
            hotelOptions.map((hotel) => (
              <div
                key={hotel.hotelId}
                onClick={() => selectAccommodation(hotel)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedHotel?.hotelId === hotel.hotelId
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="font-semibold text-lg">{hotel.name}</span>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">{hotel.location}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{renderStarRating(hotel.rating)}</div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      {hotel.amenities?.slice(0, 4).map((a, i) => (
                        <span key={i} className="flex items-center space-x-1">
                          {renderAmenityIcon(a)}
                          <span>{a.toLowerCase().replace('_', ' ')}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <div className="text-2xl font-bold text-green-600">${hotel.price}</div>
                    <div className="text-sm text-gray-500">{hotel.currency} total</div>
                    <div className="text-xs text-gray-500">${hotel.pricePerNight}/night</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-700 line-clamp-2">{hotel.description}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Click "Search Hotels" to see available options</p>
          )}
        </div>
      )}
    </div>
  );
}
