// App.js
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Plane, Car, Train, Ship, Hotel, Home, Building, Utensils, Camera, Package, Cloud, Star, Heart, DollarSign, Plus, Trash2, Edit, Save, X, Menu, ChevronDown, ChevronUp, Clock, Users, Filter, User } from 'lucide-react';

// Import components
import PlannerForm from './components/PlannerForm';
import ItineraryView from './components/ItineraryView';
import WeatherView from './components/WeatherView';
import PackingView from './components/PackingView';
import EventsView from './components/EventsView';
import FavoritesView from './components/FavoritesView';
import BudgetView from './components/BudgetView';
import Login from './components/Login';
import UserProfile from './components/UserProfile';

// Import contexts and services
import { AuthProvider, useAuth } from './contexts/AuthContext';
import dataService from './services/dataService';

const AppContent = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('planner');
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    duration: 0,
    travelMethod: 'plane',
    accommodation: 'hotels',
    foodPreferences: {
      cuisine: [],
      budget: 'medium',
      dietary: []
    },
    attractions: [],
    budget: 0
  });
  
  const [itinerary, setItinerary] = useState([]);
  const [packingList, setPackingList] = useState([]);
  const [weather, setWeather] = useState([]);
  const [localEvents, setLocalEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(true);

  // Load user data when user logs in
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const userData = await dataService.getAllUserData(currentUser.uid);
          if (userData) {
            setTripData(userData.tripData || tripData);
            setItinerary(userData.itinerary || []);
            setPackingList(userData.packingList || []);
            setFavorites(userData.favorites || []);
            setExpenses(userData.expenses || []);
            
            // If user has trip data, don't show form
            if (userData.tripData && userData.tripData.destination) {
              setShowForm(false);
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
        setLoading(false);
      } else {
        // Reset data when user logs out
        setTripData({
          destination: '',
          startDate: '',
          endDate: '',
          duration: 0,
          travelMethod: 'plane',
          accommodation: 'hotels',
          foodPreferences: {
            cuisine: [],
            budget: 'medium',
            dietary: []
          },
          attractions: [],
          budget: 0
        });
        setItinerary([]);
        setPackingList([]);
        setFavorites([]);
        setExpenses([]);
        setShowForm(true);
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser]);

  // Auto-save user data when state changes
  useEffect(() => {
    const saveUserData = async () => {
      if (currentUser && !loading) {
        try {
          await dataService.saveAllUserData(currentUser.uid, {
            tripData,
            itinerary,
            packingList,
            favorites,
            expenses
          });
        } catch (error) {
          console.error('Error auto-saving data:', error);
        }
      }
    };

    const timeoutId = setTimeout(saveUserData, 1000); // Debounce saves
    return () => clearTimeout(timeoutId);
  }, [currentUser, tripData, itinerary, packingList, favorites, expenses, loading]);

  // Mock data for demonstration
  const mockRestaurants = [
    {
      id: 1,
      name: "Local Bistro",
      cuisine: "French",
      price: "$$",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Street Food Market",
      cuisine: "Local",
      price: "$",
      rating: 4.2,
    },
    {
      id: 3,
      name: "Rooftop Restaurant",
      cuisine: "International",
      price: "$$$",
      rating: 4.7,
    },
  ];

  const mockAttractions = [
    {
      id: 1,
      name: "Historic Museum",
      type: "Culture",
      duration: "2-3 hours",
      price: "$15",
    },
    {
      id: 2,
      name: "City Park",
      type: "Nature",
      duration: "1-2 hours",
      price: "Free",
    },
    {
      id: 3,
      name: "Art Gallery",
      type: "Culture",
      duration: "1-2 hours",
      price: "$12",
    },
  ];

  const mockWeather = [
    { date: "2024-07-01", temp: "75°F", condition: "Sunny", icon: "☀️" },
    {
      date: "2024-07-02",
      temp: "72°F",
      condition: "Partly Cloudy",
      icon: "⛅",
    },
    { date: "2024-07-03", temp: "68°F", condition: "Light Rain", icon: "🌦️" },
  ];

  const mockEvents = [
    {
      id: 1,
      name: "Summer Music Festival",
      date: "2024-07-01",
      type: "Music",
      price: "$25",
    },
    {
      id: 2,
      name: "Local Food Market",
      date: "2024-07-02",
      type: "Food",
      price: "Free",
    },
    {
      id: 3,
      name: "Art Walk",
      date: "2024-07-03",
      type: "Culture",
      price: "$10",
    },
  ];

  const travelMethods = [
    { value: "plane", label: "Plane", icon: Plane },
    { value: "car", label: "Car", icon: Car },
  ];

  const accommodationTypes = [
    { value: "hotels", label: "Hotels", icon: Hotel },
    { value: "airbnb", label: "Airbnb", icon: Home },
    { value: "hostels", label: "Hostels", icon: Building },
  ];

  const cuisineTypes = [
    "Italian",
    "Asian",
    "French",
    "Mexican",
    "Local",
    "American",
    "Mediterranean",
  ];
  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Halal",
    "Kosher",
  ];

  const generateItinerary = () => {
    if (!tripData.destination || !tripData.startDate || !tripData.endDate) {
      alert("Please fill in destination and dates");
      return;
    }

    const days =
      Math.ceil(
        (new Date(tripData.endDate) - new Date(tripData.startDate)) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    const newItinerary = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(tripData.startDate);
      date.setDate(date.getDate() + i);

      newItinerary.push({
        date: date.toISOString().split("T")[0],
        day: i + 1,
        activities: [
          { ...mockAttractions[i % mockAttractions.length], time: "9:00 AM" },
          {
            ...mockRestaurants[i % mockRestaurants.length],
            time: "12:00 PM",
            type: "restaurant",
          },
          {
            ...mockAttractions[(i + 1) % mockAttractions.length],
            time: "2:00 PM",
          },
        ],
        estimatedCost: Math.floor(Math.random() * 100) + 50,
      });
    }

    setItinerary(newItinerary);
    setWeather(mockWeather.slice(0, days));
    setLocalEvents(mockEvents.slice(0, days));
    generatePackingList();
    setShowForm(false);
  };

  const generatePackingList = () => {
    const baseItems = [
      "Passport/ID",
      "Phone Charger",
      "Toiletries",
      "Medications",
    ];
    const clothingItems = [
      "Comfortable Shoes",
      "Casual Clothes",
      "Sleepwear",
      "Underwear",
    ];
    const weatherItems = weather.some((w) => w.condition.includes("Rain"))
      ? ["Rain Jacket", "Umbrella"]
      : ["Sunglasses", "Sunscreen"];

    setPackingList([...baseItems, ...clothingItems, ...weatherItems]);
  };

  const addToFavorites = (item) => {
    if (
      !favorites.find((fav) => fav.id === item.id && fav.type === item.type)
    ) {
      setFavorites([
        ...favorites,
        { ...item, type: item.type || "attraction" },
      ]);
    }
  };

  const removeFromFavorites = (itemId, type) => {
    setFavorites(
      favorites.filter((fav) => !(fav.id === itemId && fav.type === type))
    );
  };

  const addExpense = (description, amount, category) => {
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split("T")[0],
    };
    setExpenses([...expenses, newExpense]);
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const TabButton = ({ id, label, icon: Icon }) => {
    const isActive = activeTab === id;
    
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`group relative flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon size={20} className="transition-colors duration-200" />
        <span className="text-xs font-medium">{label}</span>
        
        {/* Active indicator */}
        {isActive && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-600 rounded-full"></div>
        )}
      </button>
    );
  };

  const renderContent = () => {
    if (showForm) {
      return (
        <PlannerForm
          tripData={tripData}
          setTripData={setTripData}
          travelMethods={travelMethods}
          accommodationTypes={accommodationTypes}
          cuisineTypes={cuisineTypes}
          dietaryOptions={dietaryOptions}
          generateItinerary={generateItinerary}
        />
      );
    }

    switch (activeTab) {
      case "itinerary":
        return (
          <ItineraryView
            tripData={tripData}
            itinerary={itinerary}
            addToFavorites={addToFavorites}
            setShowForm={setShowForm}
          />
        );
      case "weather": {
        const numDays =
          tripData.startDate && tripData.endDate
            ? Math.ceil(
                (new Date(tripData.endDate) - new Date(tripData.startDate)) /
                  (1000 * 60 * 60 * 24)
              ) + 1
            : 0;

        return (
          <WeatherView
            destination={tripData.destination}
            startDate={tripData.startDate}
            numDays={numDays}
          />
        );
      }
      case 'packing':
        return <PackingView packingList={packingList} />;        
      case 'events':
        return <EventsView localEvents={localEvents} addToFavorites={addToFavorites} />;
      case 'favorites':
        return <FavoritesView favorites={favorites} removeFromFavorites={removeFromFavorites} />;
      case 'budget':
        return <BudgetView tripBudget={tripData.budget} expenses={expenses} />;          
      default:
        return (
          <PlannerForm
            tripData={tripData}
            setTripData={setTripData}
            travelMethods={travelMethods}
            accommodationTypes={accommodationTypes}
            cuisineTypes={cuisineTypes}
            dietaryOptions={dietaryOptions}
            generateItinerary={generateItinerary}
          />
        );
    }
  };

  // Show login if not authenticated
  if (!currentUser) {
    return <Login />;
  }

  // Show loading spinner while loading data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your travel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Travel Planner
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                <MapPin className="text-blue-600" size={20} />
                <span className="text-sm font-medium text-gray-700">
                  {tripData.destination || "Plan your next adventure"}
                </span>
              </div>
              
              {/* User Profile Button */}
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <User size={20} />
                )}
                <span className="hidden sm:inline text-sm font-medium">
                  {currentUser.displayName || 'Profile'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

{!showForm && (
  <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-4">
        {/* Left side - Trip status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Trip Active</span>
          </div>
        </div>
        
        {/* Center - Navigation tabs */}
        <div className="flex items-center space-x-1">
          <TabButton id="itinerary" label="Itinerary" icon={Calendar} />
          <TabButton id="weather" label="Weather" icon={Cloud} />
          <TabButton id="packing" label="Packing" icon={Package} />
          <TabButton id="events" label="Events" icon={Star} />
          <TabButton id="favorites" label="Favorites" icon={Heart} />
          <TabButton id="budget" label="Budget" icon={DollarSign} />
          <button
          onClick={() => setShowForm(true)}
          className='group relative flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50'>
          <span>Edit Trip</span>
        </button>
        </div>
        
        {/* Right side - Trip progress */}
        <div className="flex items-center space-x-4">
          <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Calendar size={18} className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Days Left</div>
                <div className="text-lg font-bold text-gray-900 leading-tight">
                  {tripData.endDate ? Math.max(0, Math.ceil((new Date(tripData.endDate) - new Date()) / (1000 * 60 * 60 * 24))) : 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {renderContent()}
        </div>
      </main>

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
