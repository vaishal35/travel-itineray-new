import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, Calendar } from "lucide-react";
import EventCard from "./EventCard";

const EventsView = ({ destination, startDate, endDate, addToFavorites }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_KEY = "8iNpL4Z0alTimjTuVudVKUpPbqSFLHyE";

  useEffect(() => {
    const fetchEvents = async () => {
      if (!destination || !startDate || !API_KEY) return;
      setLoading(true);

      const params = {
        apikey: API_KEY,
        city: destination,
        startDateTime: `${startDate}T00:00:00Z`,
        ...(endDate && { endDateTime: `${endDate}T23:59:59Z` }),
        sort: "date,asc",
        size: 10,
      };
      try {
        const response = await axios.get(
          "https://app.ticketmaster.com/discovery/v2/events.json",
          { params }
        );

        const eventsList = response.data._embedded?.events || [];
        if (eventsList.length === 0) {
          console.log("Ticketmaster returned no events", params);
        }
        setEvents(eventsList);
        setError("");
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [destination, startDate, endDate, API_KEY]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl">
            <Star size={24} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Local Events
            </h2>
            <p className="text-gray-600 mt-1">
              {events.length} {events.length === 1 ? "event" : "events"}{" "}
              happening during your trip
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar size={32} className="text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              We couldn&apos;t find any local events for your travel dates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                addToFavorites={addToFavorites}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsView;
