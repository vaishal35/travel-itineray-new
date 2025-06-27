
import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Calendar } from 'lucide-react';

const WeatherView = ({ destination, startDate, numDays }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');
  const API_KEY = '14e5cb478f036316eeab752a0801ddfd'; 

  useEffect(() => {
    if (!destination || !startDate || !numDays) return;

    const fetchWeather = async () => {
      try {
        // Step 1: Get coordinates
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${destination}&limit=1&appid=${API_KEY}`         
        );

        if (!geoRes.ok) throw new Error("Failed to fetch location data");

        const geoData = await geoRes.json();
        if (!geoData[0]) throw new Error("Location not found");

        const { lat, lon } = geoData[0];

        // Step 2: Get 5-day forecast
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastRes.json();      

        // Step 3: Sample forecast every 8th entry (1 per day)
        const dailyForecasts = forecastData.list.filter((_, idx) => idx % 8 === 0).slice(0, numDays);

        const simplified = dailyForecasts.map(day => ({
          date: day.dt_txt,
          temp: `${Math.round(day.main.temp)}°C`,
          condition: day.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
        }));

        setWeatherData(simplified);
        setError('');
      } catch (err) {
        console.error(err);
        setError("Could not fetch weather data.");
      }
    };

    fetchWeather();
  }, [destination, startDate, numDays]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 px-6 py-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
            <Cloud size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Weather Forecast</h2>
            {destination && (
              <p className="text-gray-600 mt-1">{destination}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Cloud size={16} className="text-red-600" />
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        ) : weatherData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weatherData.map((day, idx) => (
              <div key={idx} className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-5">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <img 
                      src={day.icon} 
                      alt={day.condition} 
                      className="w-16 h-16" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span className="font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2">
                      <Thermometer size={18} className="text-orange-500" />
                      <span className="text-2xl font-bold text-gray-900">{day.temp}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 capitalize font-medium">
                      {day.condition}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Cloud size={32} className="text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 font-medium">Loading weather forecast...</p>
            <div className="flex justify-center space-x-1 mt-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherView;
