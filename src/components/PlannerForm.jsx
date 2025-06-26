import React, { useState, useEffect, useRef } from 'react';
import { Plane, Car, Train, Ship, Hotel, Home, Building, Search, Loader, MapPin, ChevronDown, Users,  } from 'lucide-react';
import { Calendar, Star, Wifi, Coffee, Dumbbell, Utensils, } from 'lucide-react';
import HotelSearch from './HotelSearch.jsx';

const PlannerForm = ({
  tripData,
  setTripData,
  travelMethods,
  accommodationTypes,
  cuisineTypes,
  dietaryOptions,
  generateItinerary
}) => {
  const [flightOptions, setFlightOptions] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [showFlightOptions, setShowFlightOptions] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const [hotelOptions, setHotelOptions] = useState([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [showHotelOptions, setShowHotelOptions] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const [amadeusCreds, setAmadeusCreds] = useState({
    clientId: 'W5xa2YX8AQQSRVyGQ3V8zycgDjfxtEvi',
    clientSecret: 'VIelnM8hN6RDfjRt'
  });

  // Autocomplete states
  const [currentLocationSuggestions, setCurrentLocationSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showCurrentLocationSuggestions, setShowCurrentLocationSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState(false);
  const [loadingDestination, setLoadingDestination] = useState(false);
  
  // Refs for input fields
  const currentLocationRef = useRef(null);
  const destinationRef = useRef(null);
  const currentLocationDropdownRef = useRef(null);
  const destinationDropdownRef = useRef(null);

  // Debounce timer refs
  const currentLocationTimerRef = useRef(null);
  const destinationTimerRef = useRef(null);

  // Get Amadeus access token
  const getAmadeusToken = async () => {
    try {
      const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: amadeusCreds.clientId,
          client_secret: amadeusCreds.clientSecret,
        }),
      });
      
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting Amadeus token:', error);
      return null;
    }
  };

  // Search for location suggestions using Amadeus API
  const searchLocationSuggestions = async (query, isDestination = false) => {
    if (query.length < 2) {
      if (isDestination) {
        setDestinationSuggestions([]);
        setShowDestinationSuggestions(false);
      } else {
        setCurrentLocationSuggestions([]);
        setShowCurrentLocationSuggestions(false);
      }
      return;
    }

    const setLoading = isDestination ? setLoadingDestination : setLoadingCurrentLocation;
    const setSuggestions = isDestination ? setDestinationSuggestions : setCurrentLocationSuggestions;
    const setShowSuggestions = isDestination ? setShowDestinationSuggestions : setShowCurrentLocationSuggestions;

    setLoading(true);

    try {
      const token = await getAmadeusToken();
      if (!token) {
        throw new Error('Failed to get access token');
      }

      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${encodeURIComponent(query)}&page%5Blimit%5D=10&sort=analytics.travelers.score&view=LIGHT`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.data) {
        const formattedSuggestions = data.data.map((location) => ({
          id: location.id,
          name: location.name,
          iataCode: location.iataCode,
          subType: location.subType,
          address: location.address,
          displayName: `${location.name}${location.iataCode ? ` (${location.iataCode})` : ''}`,
          fullAddress: location.address ? 
            `${location.name}${location.iataCode ? ` (${location.iataCode})` : ''}, ${location.address.cityName || ''}${location.address.stateCode ? ', ' + location.address.stateCode : ''}${location.address.countryName ? ', ' + location.address.countryName : ''}` :
            location.name
        }));
        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } else {
        // Fallback mock data when API fails
        const mockSuggestions = getMockSuggestions(query);
        setSuggestions(mockSuggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      // Show mock data on error
      const mockSuggestions = getMockSuggestions(query);
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } finally {
      setLoading(false);
    }
  };

  // Mock suggestions for fallback
  const getMockSuggestions = (query) => {
    const mockLocations = [
      { id: '1', name: 'New York', iataCode: 'JFK', subType: 'AIRPORT', displayName: 'New York (JFK)', fullAddress: 'New York (JFK), New York, NY, United States' },
      { id: '2', name: 'Los Angeles', iataCode: 'LAX', subType: 'AIRPORT', displayName: 'Los Angeles (LAX)', fullAddress: 'Los Angeles (LAX), Los Angeles, CA, United States' },
      { id: '3', name: 'Chicago', iataCode: 'ORD', subType: 'AIRPORT', displayName: 'Chicago (ORD)', fullAddress: 'Chicago (ORD), Chicago, IL, United States' },
      { id: '4', name: 'Miami', iataCode: 'MIA', subType: 'AIRPORT', displayName: 'Miami (MIA)', fullAddress: 'Miami (MIA), Miami, FL, United States' },
      { id: '5', name: 'London', iataCode: 'LHR', subType: 'AIRPORT', displayName: 'London (LHR)', fullAddress: 'London (LHR), London, United Kingdom' },
      { id: '6', name: 'Paris', iataCode: 'CDG', subType: 'AIRPORT', displayName: 'Paris (CDG)', fullAddress: 'Paris (CDG), Paris, France' },
      { id: '7', name: 'Tokyo', iataCode: 'NRT', subType: 'AIRPORT', displayName: 'Tokyo (NRT)', fullAddress: 'Tokyo (NRT), Tokyo, Japan' },
      { id: '8', name: 'Indianapolis', iataCode: 'IND', subType: 'AIRPORT', displayName: 'Indianapolis (IND)', fullAddress: 'Indianapolis (IND), Indianapolis, IN, United States' },
      { id: '9', name: 'Fort Wayne', iataCode: 'FWA', subType: 'AIRPORT', displayName: 'Fort Wayne (FWA)', fullAddress: 'Fort Wayne (FWA), Fort Wayne, IN, United States' },
      { id: '10', name: 'Orlando', iataCode: 'MCO', subType: 'AIRPORT', displayName: 'Orlando (MCO)', fullAddress: 'Orlando (MCO), Orlando, FL, United States' },
      { id: '11', name: 'Tampa', iataCode: 'TPA', subType: 'AIRPORT', displayName: 'Tampa (TPA)', fullAddress: 'Tampa (TPA), Tampa, FL, United States' },
    ];

    return mockLocations.filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      (location.iataCode && location.iataCode.toLowerCase().includes(query.toLowerCase()))
    );
  };

  // Debounced search function
  const debouncedSearch = (query, isDestination = false, delay = 300) => {
    const timerRef = isDestination ? destinationTimerRef : currentLocationTimerRef;
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      searchLocationSuggestions(query, isDestination);
    }, delay);
  };

  // Handle input changes with debounced search
  const handleCurrentLocationChange = (e) => {
    const value = e.target.value;
    setTripData({...tripData, currentLocation: value});
    debouncedSearch(value, false);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setTripData({...tripData, destination: value});
    debouncedSearch(value, true);
  };

  // Handle suggestion selection
  const selectCurrentLocationSuggestion = (suggestion) => {
    setTripData({...tripData, currentLocation: suggestion.displayName});
    setShowCurrentLocationSuggestions(false);
    setCurrentLocationSuggestions([]);
  };

  const selectDestinationSuggestion = (suggestion) => {
    setTripData({...tripData, destination: suggestion.displayName});
    setShowDestinationSuggestions(false);
    setDestinationSuggestions([]);
  };

  // Handle clicks outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currentLocationDropdownRef.current && !currentLocationDropdownRef.current.contains(event.target) && !currentLocationRef.current.contains(event.target)) {
        setShowCurrentLocationSuggestions(false);
      }
      if (destinationDropdownRef.current && !destinationDropdownRef.current.contains(event.target) && !destinationRef.current.contains(event.target)) {
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (currentLocationTimerRef.current) {
        clearTimeout(currentLocationTimerRef.current);
      }
      if (destinationTimerRef.current) {
        clearTimeout(destinationTimerRef.current);
      }
    };
  }, []);

  // Search for flights using Amadeus API
  const searchFlights = async () => {
    if (!tripData.currentLocation || !tripData.destination || !tripData.startDate) {
      alert('Please fill in current location, destination, and departure date');
      return;
    }

    const passengers = tripData.passengers || 1;
    setLoadingFlights(true);
    setShowFlightOptions(true);

    try {
      const token = await getAmadeusToken();
      if (!token) {
        throw new Error('Failed to get access token');
      }

      // Convert city names to IATA codes
      const originCode = await getCityIATACode(tripData.currentLocation, token);
      const destinationCode = await getCityIATACode(tripData.destination, token);

      console.log(`Searching flights: ${originCode} → ${destinationCode} for ${passengers} passenger(s)`);

      const response = await fetch(
        `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${originCode}&destinationLocationCode=${destinationCode}&departureDate=${tripData.startDate}&adults=${passengers}&max=10&currencyCode=USD`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const formattedFlights = data.data.map((offer, index) => {
          // Calculate total duration more accurately
          const segments = offer.itineraries[0].segments;
          const firstSegment = segments[0];
          const lastSegment = segments[segments.length - 1];
          
          // Calculate actual travel time from departure to arrival
          const departureTime = new Date(firstSegment.departure.at);
          const arrivalTime = new Date(lastSegment.arrival.at);
          const totalMinutes = Math.round((arrivalTime - departureTime) / (1000 * 60));
          
          console.log(`Flight ${index + 1}:`, {
            departure: firstSegment.departure.at,
            arrival: lastSegment.arrival.at,
            calculatedDuration: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
            apiDuration: offer.itineraries[0].duration
          });

          return {
            id: index,
            price: offer.price.total,
            currency: offer.price.currency,
            duration: offer.itineraries[0].duration,
            calculatedDuration: totalMinutes, // Store calculated duration in minutes
            departure: firstSegment.departure,
            arrival: lastSegment.arrival,
            airline: firstSegment.carrierCode,
            stops: segments.length - 1,
            segments: segments,
            passengers: passengers,
            totalPrice: (parseFloat(offer.price.total) * passengers).toFixed(2)
          };
        });
        setFlightOptions(formattedFlights);
      } else {
        console.log('No flight data from API, using mock data');
        // Enhanced mock data with realistic durations for Indiana to Florida
        const mockFlights = [
          {
            id: 1,
            price: '189.00',
            currency: 'USD',
            duration: 'PT2H25M',
            calculatedDuration: 145, // 2h 25m
            departure: { at: `${tripData.startDate}T08:00:00`, iataCode: 'IND' },
            arrival: { at: `${tripData.startDate}T11:25:00`, iataCode: 'MCO' },
            airline: 'AA',
            stops: 0,
            passengers: passengers,
            totalPrice: (189.00 * passengers).toFixed(2)
          },
          {
            id: 2,
            price: '156.00',
            currency: 'USD',
            duration: 'PT4H15M',
            calculatedDuration: 255, // 4h 15m (with layover)
            departure: { at: `${tripData.startDate}T14:20:00`, iataCode: 'IND' },
            arrival: { at: `${tripData.startDate}T19:35:00`, iataCode: 'MCO' },
            airline: 'DL',
            stops: 1,
            passengers: passengers,
            totalPrice: (156.00 * passengers).toFixed(2)
          },
          {
            id: 3,
            price: '225.00',
            currency: 'USD',
            duration: 'PT2H10M',
            calculatedDuration: 130, // 2h 10m
            departure: { at: `${tripData.startDate}T16:45:00`, iataCode: 'IND' },
            arrival: { at: `${tripData.startDate}T19:55:00`, iataCode: 'TPA' },
            airline: 'UA',
            stops: 0,
            passengers: passengers,
            totalPrice: (225.00 * passengers).toFixed(2)
          }
        ];
        setFlightOptions(mockFlights);
      }
    } catch (error) {
      console.error('Error searching flights:', error);
      // Show realistic mock data on error
      const mockFlights = [
        {
          id: 1,
          price: '189.00',
          currency: 'USD',
          duration: 'PT2H25M',
          calculatedDuration: 145,
          departure: { at: `${tripData.startDate}T08:00:00`, iataCode: 'IND' },
          arrival: { at: `${tripData.startDate}T11:25:00`, iataCode: 'MCO' },
          airline: 'AA',
          stops: 0,
          passengers: passengers,
          totalPrice: (189.00 * passengers).toFixed(2)
        }
      ];
      setFlightOptions(mockFlights);
    } finally {
      setLoadingFlights(false);
    }
  };


  // Helper function to get IATA code for a city
  const getCityIATACode = async (cityName, token) => {
    // Extract IATA code from autocomplete selection if available
    const iataMatch = cityName.match(/\(([A-Z]{3})\)/);
    if (iataMatch) {
      return iataMatch[1];
    }

    try {
      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY,AIRPORT&keyword=${encodeURIComponent(cityName)}&page%5Blimit%5D=1`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        return data.data[0].iataCode;
      }
    } catch (error) {
      console.error('Error getting IATA code:', error);
    }
    
    // Enhanced fallback mapping for Indiana and Florida airports
    const cityToIATA = {
      'New York': 'JFK',
      'Los Angeles': 'LAX',
      'Chicago': 'ORD',
      'Miami': 'MIA',
      'London': 'LHR',
      'Paris': 'CDG',
      'Tokyo': 'NRT',
      'Indianapolis': 'IND',
      'Fort Wayne': 'FWA',
      'Orlando': 'MCO',
      'Tampa': 'TPA',
      'Jacksonville': 'JAX',
      'Fort Lauderdale': 'FLL'
    };
    
    // Try to match city name from the input
    const cityMatch = Object.keys(cityToIATA).find(city => 
      cityName.toLowerCase().includes(city.toLowerCase())
    );
    
    return cityMatch ? cityToIATA[cityMatch] : 'IND'; // Default to Indianapolis
  };

  // Improved duration formatting
  const formatDuration = (duration, calculatedMinutes = null) => {
    // Use calculated duration if available (more accurate)
    if (calculatedMinutes) {
      const hours = Math.floor(calculatedMinutes / 60);
      const minutes = calculatedMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
    
    // Fallback to parsing ISO 8601 duration
    if (duration && duration.startsWith('PT')) {
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
      const hours = match[1] ? parseInt(match[1]) : 0;
      const minutes = match[2] ? parseInt(match[2]) : 0;
      return `${hours}h ${minutes}m`;
    }
    
    return 'N/A';
  };

  // Format time
  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle travel method selection
  const handleTravelMethodChange = (method) => {
    setTripData({...tripData, travelMethod: method});
    if (method === 'plane') {
      setShowFlightOptions(true);
    } else {
      setShowFlightOptions(false);
      setFlightOptions([]);
      setSelectedFlight(null);
    }
  };

  // Handle accommodation type selection
  const handleAccommodationChange = (accommodation) => {
    setTripData({...tripData, accommodation: accommodation});
    if (accommodation === 'hotel') {
      setShowHotelOptions(true);
    } else {
      setShowHotelOptions(false);
      setHotelOptions([]);
      setSelectedHotel(null);
    }
  };

  // Select a flight
  const selectFlight = (flight) => {
    setSelectedFlight(flight);
    setTripData({
      ...tripData,
      selectedFlight: flight,
      estimatedTravelCost: parseFloat(flight.totalPrice)
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Plan Your Trip</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Location with Autocomplete */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin size={16} className="inline mr-1" />
            Current Location
          </label>
          <div className="relative">
            <input
              ref={currentLocationRef}
              type="text"
              value={tripData.currentLocation || ''}
              onChange={handleCurrentLocationChange}
              onFocus={() => {
                if (currentLocationSuggestions.length > 0) {
                  setShowCurrentLocationSuggestions(true);
                }
              }}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Where are you starting from?"
              autoComplete="off"
            />
            {loadingCurrentLocation && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader size={16} className="animate-spin text-gray-400" />
              </div>
            )}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
          
          {/* Current Location Suggestions Dropdown */}
          {showCurrentLocationSuggestions && currentLocationSuggestions.length > 0 && (
            <div
              ref={currentLocationDropdownRef}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {currentLocationSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => selectCurrentLocationSuggestion(suggestion)}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{suggestion.displayName}</div>
                  {suggestion.fullAddress !== suggestion.displayName && (
                    <div className="text-sm text-gray-500 mt-1">{suggestion.fullAddress}</div>
                  )}
                  <div className="text-xs text-blue-600 mt-1 capitalize">
                    {suggestion.subType.toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Destination with Autocomplete */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <div className="relative">
            <input
              ref={destinationRef}
              type="text"
              value={tripData.destination}
              onChange={handleDestinationChange}
              onFocus={() => {
                if (destinationSuggestions.length > 0) {
                  setShowDestinationSuggestions(true);
                }
              }}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Where are you going?"
              autoComplete="off"
            />
            {loadingDestination && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader size={16} className="animate-spin text-gray-400" />
              </div>
            )}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
          
          {/* Destination Suggestions Dropdown */}
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div
              ref={destinationDropdownRef}
              className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {destinationSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => selectDestinationSuggestion(suggestion)}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{suggestion.displayName}</div>
                  {suggestion.fullAddress !== suggestion.displayName && (
                    <div className="text-sm text-gray-500 mt-1">{suggestion.fullAddress}</div>
                  )}
                  <div className="text-xs text-blue-600 mt-1 capitalize">
                    {suggestion.subType.toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={tripData.startDate}
            onChange={(e) => setTripData({...tripData, startDate: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={tripData.endDate}
            onChange={(e) => setTripData({...tripData, endDate: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Number of Passengers */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Users size={16} className="inline mr-1" />
          Number of Passengers
        </label>
        <select
          value={tripData.passengers || 1}
          onChange={(e) => setTripData({...tripData, passengers: parseInt(e.target.value)})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'Passenger' : 'Passengers'}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Travel Method
        </label>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
          {travelMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.value}
                onClick={() => handleTravelMethodChange(method.value)}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                  tripData.travelMethod === method.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon size={24} className="mb-2" />
                <span className="text-sm font-medium">{method.label}</span>
              </button>
            );
          })}
        </div>

        {/* Flight Search Section */}
        {tripData.travelMethod === 'plane' && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Flight Options
                {tripData.passengers > 1 && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    (for {tripData.passengers} passengers)
                  </span>
                )}
              </h3>
              <button
                onClick={searchFlights}
                disabled={loadingFlights}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loadingFlights ? (
                  <Loader size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
                <span>{loadingFlights ? 'Searching...' : 'Search Flights'}</span>
              </button>
            </div>

            {showFlightOptions && (
              <div className="space-y-3">
                {loadingFlights ? (
                  <div className="text-center py-8">
                    <Loader size={32} className="animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Searching for flights...</p>
                  </div>
                ) : flightOptions.length > 0 ? (
                  flightOptions.map((flight) => (
                    <div
                      key={flight.id}
                      onClick={() => selectFlight(flight)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedFlight?.id === flight.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <span className="font-semibold text-lg">
                              {flight.departure.iataCode} → {flight.arrival.iataCode}
                            </span>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {flight.airline}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <span>
                              Departure: {formatTime(flight.departure.at)}
                            </span>
                            <span>
                              Arrival: {formatTime(flight.arrival.at)}
                            </span>
                            <span>
                              Duration: {formatDuration(flight.duration)}
                            </span>
                            <span>
                              {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${flight.price}
                          </div>
                          <div className="text-sm text-gray-500">
                            {flight.currency}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Click "Search Flights" to see available options
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Accommodation Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {accommodationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => handleAccommodationChange(method.value)}
                className={`flex items-center p-4 rounded-lg border-2 transition-colors ${
                  tripData.accommodation === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>

      <HotelSearch tripData={tripData} setTripData={setTripData} getAmadeusToken={getAmadeusToken}/>

      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Food Preferences
        </label>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Cuisine Types</label>
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => {
                    const current = tripData.foodPreferences.cuisine;
                    const updated = current.includes(cuisine)
                      ? current.filter(c => c !== cuisine)
                      : [...current, cuisine];
                    setTripData({
                      ...tripData,
                      foodPreferences: {...tripData.foodPreferences, cuisine: updated}
                    });
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    tripData.foodPreferences.cuisine.includes(cuisine)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Dietary Restrictions</label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    const current = tripData.foodPreferences.dietary;
                    const updated = current.includes(option)
                      ? current.filter(d => d !== option)
                      : [...current, option];
                    setTripData({
                      ...tripData,
                      foodPreferences: {...tripData.foodPreferences, dietary: updated}
                    });
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    tripData.foodPreferences.dietary.includes(option)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className='mt-4'>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget ($)
          </label>
          <input
            type="number"
            value={tripData.budget}
            onChange={(e) => setTripData({...tripData, budget: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Total budget"
          />
        </div>

      {selectedFlight && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Selected Flight</h3>
          <p className="text-green-700">
            {selectedFlight.departure.iataCode} → {selectedFlight.arrival.iataCode} - 
            ${selectedFlight.price} ({selectedFlight.airline})
          </p>
        </div>
      )}

      <button
        onClick={generateItinerary}
        className="w-full mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Generate Itinerary
      </button>
    </div>
  );
};

export default PlannerForm;
