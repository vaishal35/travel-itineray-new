import { useEffect, useState } from 'react';

const WeatherView = ({ destination, startDate, numDays }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');
  const API_KEY = '14e5cb478f036316eeab752a0801ddfd'; 

  useEffect(() => {
    if (!destination || !startDate || !numDays) { console};

    const fetchWeather = async () => {
      try {
        // Step 1: Get coordinates
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${destination}&limit=1&appid=${API_KEY}`         
        );

        console.log('geoRes:', geoRes);
        if (!geoRes.ok) throw new Error("Failed to fetch location data");

        const geoData = await geoRes.json();
        if (!geoData[0]) throw new Error("Location not found");

        const { lat, lon } = geoData[0];

        // Step 2: Get 5-day forecast
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastRes.json();
        console.log('Forecast result:', forecastData);

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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Weather Forecast</h2>
      {error && <p className="text-red-600">{error}</p>}
      { !error && weatherData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weatherData.map((day, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
              <img src={day.icon} alt={day.condition} className="w-16 h-16 mx-auto mb-2" />
              <div className="font-medium text-gray-800">{new Date(day.date).toLocaleDateString()}</div>
              <div className="text-xl font-bold text-gray-900 my-1">{day.temp}</div>
              <div className="text-sm text-gray-600 capitalize">{day.condition}</div>
            </div>
          ))}
        </div>
      ) : (
        !error && <p>Loading weather...</p>
      )}
    </div>
  );
};

export default WeatherView;
