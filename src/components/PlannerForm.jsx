// src/components/PlannerForm.jsx
import WeatherView from "./WeatherView";
const PlannerForm = ({
  tripData,
  setTripData,
  travelMethods,
  accommodationTypes,
  cuisineTypes,
  dietaryOptions,
  generateItinerary
}) => {

   // Calculate numDays dynamically from startDate and endDate
  const calculateNumDays = () => {
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const timeDiff = end - start;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(days) || days < 1 ? 0 : days;
  };
 
  return (
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
};

export default PlannerForm;
