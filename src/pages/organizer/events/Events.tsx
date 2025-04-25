import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { fetchEventsByOrganizer } from "../../../redux/slices/eventSlice";
import EventsNav from "./EventsNav";
import { useParams } from "react-router";
import EventDrafts from "./EventDrafts";
import EventForm from "./EventForm";
import EventsApproved from "./EventsApproved";

const EventsPage = () => {
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [filters, setFilters] = useState({ type: "", mode: "", department: "", search: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  const { events, loading, error } = useSelector((state: RootState) => state.events);

  const { subpage } = useParams();

  // Fetch events when userId is available
  useEffect(() => {
    if(user){
      dispatch(fetchEventsByOrganizer(user.id) as any);
    }
  }, [dispatch, user]);

  // Update filteredEvents when events are fetched
  useEffect(() => {
    setFilteredEvents(events.filter(event => event.status === "live"));
  }, [events]);

  // Handle filters
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };

      // Apply filtering
      const filtered = events.filter(event =>
        event.status === "live" &&
        (!newFilters.type || event.type === newFilters.type) &&
        (!newFilters.mode || event.mode === newFilters.mode) &&
        (!newFilters.department || event.department === newFilters.department) &&
        event.name.toLowerCase().includes(newFilters.search.toLowerCase())
      );

      setFilteredEvents(filtered);
      return newFilters;
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <EventsNav subpage={subpage} />

      {
        subpage === undefined && !loading && !error && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">All Events</h2>
              {/* <Link
                to={'/organizer/events/create'}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create New Event
              </Link> */}
            </div>

            {/* Search Bar */}
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search event by name..."
              className="w-full p-2 mb-4 border rounded"
            />

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <select name="type" onChange={handleFilterChange} className="bg-gray-100 p-2 rounded">
                <option value="">All Types</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
              </select>
              <select name="mode" onChange={handleFilterChange} className="bg-gray-100 p-2 rounded">
                <option value="">All Modes</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
              <select name="department" onChange={handleFilterChange} className="bg-gray-100 p-2 rounded">
                <option value="">All Departments</option>
                <option value="Computer">Computer Science</option>
                <option value="IT">Information Technology</option>
                <option value="AIML">AI & ML</option>
                <option value="Civil">Civil Engineering</option>
                <option value="Mechanical">Mechanical Engineering</option>
                <option value="ENTC">Electronics & Telecommunication</option>
              </select>
            </div>

            {/* Events List */}
            {loading ? (
              <p className="text-center text-gray-500">Loading events...</p>
            ) : error ? (
              <p className="text-center text-red-500">Error: {error}</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                    <div key={event.id} className="bg-white shadow-md rounded-lg p-4">
                      <h3 className="text-lg font-semibold">{event.name}</h3>
                      <p className="text-gray-600">{event.type} | {event.mode}</p>
                      <p className="text-sm text-gray-500">📅 {event.start_date} - {event.end_date}</p>
                      <p className="text-sm text-gray-500">📍 {event.venue}</p>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => navigate(`/organizer/events/view/${event.id}`)}
                          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => navigate(`/organizer/events/update/${event.id}`)}
                          className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
                        >
                          Update Event
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 col-span-3">No events found.</p>
                )}
              </div>
            )}
          </div>
        )
      }

      {
        subpage === 'drafts' && (
          <EventDrafts />
        )
      }

      {
        subpage === 'create' && (
          <EventForm />
        )
      }

      {
        subpage === 'approved' && (
          <EventsApproved />
        )
      }
    </div>
  );
};

export default EventsPage;
