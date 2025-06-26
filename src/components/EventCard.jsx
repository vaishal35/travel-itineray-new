import {
  Heart,
  Calendar,
  DollarSign,
  Star,
  Music,
  Utensils,
  Palette,
} from "lucide-react";

const EventCard = ({ event, addToFavorites }) => {
  const image = event.images?.[0]?.url || "/placeholder.png";
  const venue = event._embedded?.venues?.[0];
  const score = event?.score || event?._score || 0;
  const genre = event.classifications?.[0]?.segment?.name || "Event";

  // Google Maps link
  const mapLink = venue?.location
    ? `https://www.google.com/maps?q=${venue.location.latitude},${venue.location.longitude}`
    : null;

  const getEventIcon = (type) => {
    switch (type.toLowerCase()) {
      case "music":
        return <Music size={16} className="text-purple-600" />;
      case "food":
        return <Utensils size={16} className="text-orange-600" />;
      case "culture":
        return <Palette size={16} className="text-blue-600" />;
      default:
        return <Star size={16} className="text-gray-600" />;
    }
  };

  const getEventBadgeColor = (type) => {
    switch (type.toLowerCase()) {
      case "music":
        return "bg-purple-100 text-purple-800";
      case "food":
        return "bg-orange-100 text-orange-800";
      case "culture":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div
      key={event.id}
      className="bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-5"
    >
      <img src={image} alt={event.name} className="w-full h-48 object-cover" />

      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm">
            {getEventIcon(event.type)}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {event.name}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{event.dates.start.localDate}</span>
              </div>

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getEventBadgeColor(event.type)}`}
              >
                {event.type}
              </span>
            </div>
          
              <div className="flex items-center space-x-2">
                <DollarSign size={16} className="text-green-600" />
                <span className="font-semibold text-green-700">
                  {event.price === "Free" ? "Free" : event.price}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                {/* Popularity Badge */}
                {score > 0.8 && (
                  <span className="inline-block bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                    🔥 Popular Event
                  </span>
                )}

                {/* AI-style Suggestion */}
                <p className="text-xs text-gray-500 italic">
                  Suggested: More {genre.toLowerCase()} events in your travel
                  period
                </p>

                {/* Map & Ticket Link */}
                <div className="flex justify-between items-center mt-2 text-sm">
                  {mapLink ? (
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      📍 Map
                    </a>
                  ) : (
                    <span className="text-gray-400">No location</span>
                  )}

                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    🎟 Buy Tickets
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => addToFavorites(event)}
          className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4"
        >
          <Heart size={18} />
        </button>
      </div>
    </div>
  );
};

export default EventCard;
