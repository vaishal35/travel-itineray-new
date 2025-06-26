import { useEffect, useState } from 'react';
import axios from 'axios';

const EventList = ({ destination, startDate, endDate }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = '8iNpL4Z0alTimjTuVudVKUpPbqSFLHyE';

  useEffect(() => {
    const fetchEvents = async () => {
      if (!destination || !startDate || !API_KEY) return;
      setLoading(true);

      try {
        const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
          params: {
            apikey: API_KEY,
            city: destination,
            startDateTime: `${startDate}T00:00:00Z`,
            ...(endDate && { endDateTime: `${endDate}T23:59:59Z` }),
            sort: 'date,asc',
            size: 10,
          }
        });

        const eventsList = response.data._embedded?.events || [];
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [destination, startDate, endDate, API_KEY]);

  if (loading) return <p className="text-center text-blue-600">Loading events...</p>;
  if (events.length === 0) return <p className="text-center text-gray-500">No events found for your trip.</p>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map(event => (
        <div key={event.id} className="bg-white shadow-lg rounded-xl overflow-hidden">
          <img src={event.images?.[0]?.url} alt={event.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h3 className="font-bold text-lg">{event.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{event.dates.start.localDate}</p>
            <p className="text-sm text-gray-700">{event._embedded?.venues?.[0]?.name}</p>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-3 text-blue-500 font-semibold hover:underline"
            >
              Buy Tickets
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
