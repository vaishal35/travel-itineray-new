import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Plane, Car, Train, Ship, Hotel, Home, Building, Utensils, Camera, Package, Cloud, Star, Heart, DollarSign, Plus, Trash2, Edit, Save, X, Menu, ChevronDown, ChevronUp, Clock, Users, Filter } from 'lucide-react';
import PlannerForm from './components/PlannerForm';
import ItineraryView from './components/ItineraryView';
import WeatherView from './components/WeatherView';
import PackingView from './components/PackingView';
import EventsView from './components/EventsView';
import FavoritesView from './components/FavoritesView';
import BudgetView from './components/BudgetView';


const App = () => {
  const [activeTab, setActiveTab] = useState('planner');
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

  // Mock data for demonstration
  const mockRestaurants = [
    { id: 1, name: "Local Bistro", cuisine: "French", price: "$$", rating: 4.5 },
    { id: 2, name: "Street Food Market", cuisine: "Local", price: "$", rating: 4.2 },
    { id: 3, name: "Rooftop Restaurant", cuisine: "International", price: "$$$", rating: 4.7 }
  ];

  const mockAttractions = [
    { id: 1, name: "Historic Museum", type: "Culture", duration: "2-3 hours", price: "$15" },
    { id: 2, name: "City Park", type: "Nature", duration: "1-2 hours", price: "Free" },
    { id: 3, name: "Art Gallery", type: "Culture", duration: "1-2 hours", price: "$12" }
  ];

  const mockWeather = [
    { date: "2024-07-01", temp: "75°F", condition: "Sunny", icon: "☀️" },
    { date: "2024-07-02", temp: "72°F", condition: "Partly Cloudy", icon: "⛅" },
    { date: "2024-07-03", temp: "68°F", condition: "Light Rain", icon: "🌦️" }
  ];

  const mockEvents = [
    { id: 1, name: "Summer Music Festival", date: "2024-07-01", type: "Music", price: "$25" },
    { id: 2, name: "Local Food Market", date: "2024-07-02", type: "Food", price: "Free" },
    { id: 3, name: "Art Walk", date: "2024-07-03", type: "Culture", price: "$10" }
  ];

  const travelMethods = [
    { value: 'plane', label: 'Plane', icon: Plane },
    { value: 'car', label: 'Car', icon: Car },
  ];

  const accommodationTypes = [
    { value: 'hotels', label: 'Hotels', icon: Hotel },
    { value: 'airbnb', label: 'Airbnb', icon: Home },
    { value: 'hostels', label: 'Hostels', icon: Building }
  ];

  const cuisineTypes = ['Italian', 'Asian', 'French', 'Mexican', 'Local', 'American', 'Mediterranean'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Kosher'];

  const generateItinerary = () => {
    if (!tripData.destination || !tripData.startDate || !tripData.endDate) {
      alert('Please fill in destination and dates');
      return;
    }

    const days = Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const newItinerary = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(tripData.startDate);
      date.setDate(date.getDate() + i);
      
      newItinerary.push({
        date: date.toISOString().split('T')[0],
        day: i + 1,
        activities: [
          { ...mockAttractions[i % mockAttractions.length], time: '9:00 AM' },
          { ...mockRestaurants[i % mockRestaurants.length], time: '12:00 PM', type: 'restaurant' },
          { ...mockAttractions[(i + 1) % mockAttractions.length], time: '2:00 PM' }
        ],
        estimatedCost: Math.floor(Math.random() * 100) + 50
      });
    }

    setItinerary(newItinerary);
    setWeather(mockWeather.slice(0, days));
    setLocalEvents(mockEvents.slice(0, days));
    generatePackingList();
    setShowForm(false);
  };

  const generatePackingList = () => {
    const baseItems = ['Passport/ID', 'Phone Charger', 'Toiletries', 'Medications'];
    const clothingItems = ['Comfortable Shoes', 'Casual Clothes', 'Sleepwear', 'Underwear'];
    const weatherItems = weather.some(w => w.condition.includes('Rain')) 
      ? ['Rain Jacket', 'Umbrella'] 
      : ['Sunglasses', 'Sunscreen'];
    
    setPackingList([...baseItems, ...clothingItems, ...weatherItems]);
  };

  const addToFavorites = (item) => {
    if (!favorites.find(fav => fav.id === item.id && fav.type === item.type)) {
      setFavorites([...favorites, { ...item, type: item.type || 'attraction' }]);
    }
  };

  const removeFromFavorites = (itemId, type) => {
    setFavorites(favorites.filter(fav => !(fav.id === itemId && fav.type === type)));
  };

  const addExpense = (description, amount, category) => {
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([...expenses, newExpense]);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon size={20} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );


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
      case 'itinerary':
        return (
          <ItineraryView
            tripData={tripData}
            itinerary={itinerary}
            addToFavorites={addToFavorites}
            setShowForm={setShowForm}
          />
        );
      case 'weather': {
        const numDays =
          tripData.startDate && tripData.endDate
            ? Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24)) + 1
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
          return <EventsView 
            destination={tripData.destination}
            startDate={tripData.startDate}
            endDate={tripData.endDate}/>;
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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Travel Planner</h1>
            <div className="flex items-center space-x-2">
              <MapPin className="text-blue-600" size={24} />
              <span className="text-sm text-gray-600">{tripData.destination || 'Plan your next adventure'}</span>
            </div>
          </div>
        </div>
      </header>

      {!showForm && (
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-4 py-4 overflow-x-auto">
              <TabButton id="itinerary" label="Itinerary" icon={Calendar} />
              <TabButton id="weather" label="Weather" icon={Cloud} />
              <TabButton id="packing" label="Packing" icon={Package} />
              <TabButton id="events" label="Events" icon={Star} />
              <TabButton id="favorites" label="Favorites" icon={Heart} />
              <TabButton id="budget" label="Budget" icon={DollarSign} />
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
