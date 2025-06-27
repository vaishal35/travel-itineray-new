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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-9xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Plan Your Perfect Trip
          </h1>
          <p className="text-gray-600 text-lg">Discover amazing destinations and create unforgettable memories</p>
        </div>
  
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Trip Basics */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Location Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Where To?</h2>
                  <p className="text-gray-500 text-sm">Set your journey's start and end points</p>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Location */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Starting From
                  </label>
                  <div className="relative group">
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
                      className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your departure city"
                      autoComplete="off"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      {loadingCurrentLocation && (
                        <Loader size={18} className="animate-spin text-blue-500" />
                      )}
                      <ChevronDown size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                  </div>
  
                  {/* Current Location Suggestions */}
                  {showCurrentLocationSuggestions && currentLocationSuggestions.length > 0 && (
                    <div
                      ref={currentLocationDropdownRef}
                      className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
                    >
                      {currentLocationSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          onClick={() => selectCurrentLocationSuggestion(suggestion)}
                          className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="font-semibold text-gray-900">{suggestion.displayName}</div>
                          {suggestion.fullAddress !== suggestion.displayName && (
                            <div className="text-sm text-gray-500 mt-1">{suggestion.fullAddress}</div>
                          )}
                          <div className="text-xs text-blue-600 mt-1 font-medium capitalize">
                            {suggestion.subType.toLowerCase()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
  
                {/* Destination */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Going To
                  </label>
                  <div className="relative group">
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
                      className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your destination"
                      autoComplete="off"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      {loadingDestination && (
                        <Loader size={18} className="animate-spin text-blue-500" />
                      )}
                      <ChevronDown size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                  </div>
  
                  {/* Destination Suggestions */}
                  {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                    <div
                      ref={destinationDropdownRef}
                      className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto"
                    >
                      {destinationSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          onClick={() => selectDestinationSuggestion(suggestion)}
                          className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="font-semibold text-gray-900">{suggestion.displayName}</div>
                          {suggestion.fullAddress !== suggestion.displayName && (
                            <div className="text-sm text-gray-500 mt-1">{suggestion.fullAddress}</div>
                          )}
                          <div className="text-xs text-blue-600 mt-1 font-medium capitalize">
                            {suggestion.subType.toLowerCase()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
  
            {/* Dates & Passengers Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="text-green-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Trip Details</h2>
                  <p className="text-gray-500 text-sm">When are you traveling and with how many people?</p>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={tripData.startDate}
                    onChange={(e) => setTripData({...tripData, startDate: e.target.value})}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={tripData.endDate}
                    onChange={(e) => setTripData({...tripData, endDate: e.target.value})}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
  
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Travelers
                  </label>
                  <select
                    value={tripData.passengers || 1}
                    onChange={(e) => setTripData({...tripData, passengers: parseInt(e.target.value)})}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Traveler' : 'Travelers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
  
            {/* Travel Method Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <div className="text-purple-600">✈️</div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">How Are You Traveling?</h2>
                  <p className="text-gray-500 text-sm">Choose your preferred mode of transportation</p>
                </div>
              </div>
  
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {travelMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.value}
                      onClick={() => handleTravelMethodChange(method.value)}
                      className={`relative flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        tripData.travelMethod === method.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={32} className="mb-3" />
                      <span className="text-sm font-semibold">{method.label}</span>
                      {tripData.travelMethod === method.value && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
  
              {/* Flight Search Section */}
              {tripData.travelMethod === 'plane' && (
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Flight Options</h3>
                      {tripData.passengers > 1 && (
                        <p className="text-sm text-gray-600 mt-1">
                          Searching for {tripData.passengers} passengers
                        </p>
                      )}
                    </div>
                    <button
                      onClick={searchFlights}
                      disabled={loadingFlights}
                      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingFlights ? (
                        <Loader size={18} className="animate-spin" />
                      ) : (
                        <Search size={18} />
                      )}
                      <span className="font-semibold">{loadingFlights ? 'Searching...' : 'Find Flights'}</span>
                    </button>
                  </div>
  
                  {showFlightOptions && (
                    <div className="space-y-4">
                      {loadingFlights ? (
                        <div className="text-center py-12">
                          <Loader size={40} className="animate-spin mx-auto mb-4 text-blue-600" />
                          <p className="text-gray-600 font-medium">Finding the best flights for you...</p>
                          <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                        </div>
                      ) : flightOptions.length > 0 ? (
                        flightOptions.map((flight) => (
                          <div
                            key={flight.id}
                            onClick={() => selectFlight(flight)}
                            className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                              selectedFlight?.id === flight.id
                                ? 'border-green-500 bg-green-50 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-3">
                                  <span className="font-bold text-xl text-gray-800">
                                    {flight.departure.iataCode} → {flight.arrival.iataCode}
                                  </span>
                                  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full font-medium">
                                    {flight.airline}
                                  </span>
                                  {selectedFlight?.id === flight.id && (
                                    <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full font-medium">
                                      Selected
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium text-gray-800">Departure</span>
                                    <p>{formatTime(flight.departure.at)}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-800">Arrival</span>
                                    <p>{formatTime(flight.arrival.at)}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-800">Duration</span>
                                    <p>{formatDuration(flight.duration)}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-800">Stops</span>
                                    <p>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right ml-6">
                                <div className="text-3xl font-bold text-green-600">
                                  ${flight.price}
                                </div>
                                <div className="text-sm text-gray-500 font-medium">
                                  {flight.currency}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={24} className="text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">Click "Find Flights" to see available options</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
  
            {/* Accommodation Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <div className="text-orange-600">🏨</div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Where Will You Stay?</h2>
                  <p className="text-gray-500 text-sm">Choose your accommodation preference</p>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {accommodationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => handleAccommodationChange(type.value)}
                      className={`relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        tripData.accommodation === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={24} className="mr-3" />
                      <span className="font-semibold">{type.label}</span>
                      {tripData.accommodation === type.value && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
  
              <HotelSearch 
                tripData={tripData} 
                setTripData={setTripData} 
                getAmadeusToken={getAmadeusToken}
              />
            </div>
          </div>
  
          {/* Right Column - Preferences & Actions */}
          <div className="space-y-6">
            
            {/* Food Preferences Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <div className="text-red-600">🍴</div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Food Preferences</h2>
                  <p className="text-gray-500 text-sm">Customize your dining experience</p>
                </div>
              </div>
  
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Cuisine Types
                  </label>
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
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                          tripData.foodPreferences.cuisine.includes(cuisine)
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>
  
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Dietary Restrictions
                  </label>
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
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                          tripData.foodPreferences.dietary.includes(option)
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
  
            {/* Budget Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <div className="text-green-600">💰</div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Budget</h2>
                  <p className="text-gray-500 text-sm">Set your spending limit</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  $
                </div>
                <input
                  type="number"
                  value={tripData.budget}
                  onChange={(e) => setTripData({...tripData, budget: e.target.value})}
                  className="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white text-lg font-semibold"
                  placeholder="5000"
                />
              </div>
            </div>
  
            {/* Selected Flight Summary */}
            {selectedFlight && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <h3 className="font-bold text-green-800 text-lg">Flight Selected</h3>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800 text-lg">
                        {selectedFlight.departure.iataCode} → {selectedFlight.arrival.iataCode}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{selectedFlight.airline}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${selectedFlight.price}</p>
                      <p className="text-sm text-gray-500">{selectedFlight.currency}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
  
            {/* Generate Button */}
            <button
              onClick={generateItinerary}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              🚀 Generate My Dream Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerForm;
