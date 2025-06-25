import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Plane, Car, Train, Ship, Hotel, Home, Building, Utensils, Camera, Package, Cloud, Star, Heart, DollarSign, Plus, Trash2, Edit, Save, X, Menu, ChevronDown, ChevronUp, Clock, Users, Filter } from 'lucide-react';

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
    { value: 'train', label: 'Train', icon: Train },
    { value: 'boat', label: 'Boat', icon: Ship }
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

  const PlannerForm = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Plan Your Trip</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destination
          </label>
          <input
            type="text"
            value={tripData.destination}
            onChange={(e) => setTripData({...tripData, destination: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Where are you going?"
          />
        </div>

        <div>
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

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Travel Method
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {travelMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.value}
                onClick={() => setTripData({...tripData, travelMethod: method.value})}
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
                onClick={() => setTripData({...tripData, accommodation: type.value})}
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

      <button
        onClick={generateItinerary}
        className="w-full mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Generate Itinerary
      </button>
    </div>
  );

  const ItineraryView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {tripData.destination} Itinerary
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Edit Trip
        </button>
      </div>

      {itinerary.map((day) => (
        <div key={day.day} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Day {day.day} - {new Date(day.date).toLocaleDateString()}
            </h3>
            <span className="text-lg font-medium text-green-600">
              ~${day.estimatedCost}
            </span>
          </div>

          <div className="space-y-4">
            {day.activities.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-500 w-20">
                    {activity.time}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{activity.name}</h4>
                    <p className="text-sm text-gray-600">
                      {activity.type === 'restaurant' ? activity.cuisine : activity.type} 
                      {activity.price && ` • ${activity.price}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => addToFavorites(activity)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Heart size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const WeatherView = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Weather Forecast</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {weather.map((day, idx) => (
          <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-2">{day.icon}</div>
            <div className="font-medium text-gray-800">{new Date(day.date).toLocaleDateString()}</div>
            <div className="text-2xl font-bold text-gray-900 my-2">{day.temp}</div>
            <div className="text-sm text-gray-600">{day.condition}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const PackingView = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Packing List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packingList.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <input type="checkbox" className="w-5 h-5 text-blue-600" />
            <span className="text-gray-800">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const EventsView = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Local Events</h2>
      <div className="space-y-4">
        {localEvents.map((event) => (
          <div key={event.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">{event.name}</h3>
              <p className="text-sm text-gray-600">{event.type} • {new Date(event.date).toLocaleDateString()}</p>
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

  const FavoritesView = () => (
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
                <p className="text-sm text-gray-600">{item.type} {item.price && `• ${item.price}`}</p>
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

  const BudgetView = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Budget Tracker</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">${tripData.budget}</div>
          <div className="text-sm text-gray-600">Total Budget</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Spent</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">${(tripData.budget - totalExpenses).toFixed(2)}</div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No expenses recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{expense.description}</div>
                  <div className="text-sm text-gray-600">{expense.category} • {expense.date}</div>
                </div>
                <div className="font-medium text-gray-800">${expense.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (showForm) return <PlannerForm />;
    
    switch (activeTab) {
      case 'itinerary': return <ItineraryView />;
      case 'weather': return <WeatherView />;
      case 'packing': return <PackingView />;
      case 'events': return <EventsView />;
      case 'favorites': return <FavoritesView />;
      case 'budget': return <BudgetView />;
      default: return <PlannerForm />;
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