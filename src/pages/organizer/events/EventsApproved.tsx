import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const EventsApproved = () => {
  const { events, loading, error } = useSelector((state: RootState) => state.events);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter events with status 'approved'
  const approvedEvents = events?.filter(event => 
    event.status === "upcoming" && event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Approved Events</h2>
      <input 
        type="text" 
        placeholder="Search event..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        className="p-2 border rounded mb-4 w-full"
      />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <ul className="space-y-4">
          {approvedEvents.length > 0 ? (
            approvedEvents.map(event => (
              <li key={event.id} className="p-4 border rounded-md shadow-md">
                <h3 className="text-lg font-medium">{event.name}</h3>
                <p className="text-gray-600">{event.description}</p>
              </li>
            ))
          ) : (
            <p>No approved events available.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default EventsApproved;