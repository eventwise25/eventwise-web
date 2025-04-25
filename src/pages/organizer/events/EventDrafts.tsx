import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { checkPermission } from "../../../services/permissionsService";
import Modal from "../../../components/cards/Modal";
import { updateEvent } from "../../../services/eventService";
import { EventFormData } from "../../../interface/Events";
import { getResourceById } from "../../../services/resourceService";
import { addLiveEvent, removeDraftEvent } from "../../../redux/slices/eventSlice";

const EventDrafts = () => {
  const { loading, error, drafts } = useSelector((state: RootState) => state.events);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // const draftEvents = [
  //   ...drafts,
  //   ...events.filter(event => event.status === "draft")
  // ].filter(event =>
  //   event.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handleDraftClick = async (event: any) => {
    setModalOpen(true);
    setSelectedEvent(event);
    setIsLoadingStatus(true);

    if(!user || user.role !== 'organizer') return;

    const timeSlot = {
      start_date: event.start_date,
      end_date: event.end_date,
      start_time: event.start_time,
      end_time: event.end_time
    };

    const permission = await checkPermission(user.college_id, event.id, user.id, timeSlot);
    
    console.log(drafts);
    
    if(permission !== null){
      setPermissionStatus(permission.status);

      const resource = await getResourceById(user.college_id, permission?.resource_id);
      if(resource){
        setVenue(resource?.name);
      }
    } 
    else{
      setPermissionStatus("none");
    }
    setIsLoadingStatus(false);
  };

  const handleCreateEvent = async () => {

    if (!user || user.role !== 'organizer') {
      alert("Access Denined!");
      return;
    }
    if (!selectedEvent) return;

    const updateObj: Partial<EventFormData> = {
      status: "live",
      venue: venue,
    };

    const response = await updateEvent(user.id, selectedEvent.id, updateObj);

    if (response.success) {
      alert("Event created successfully!");

      // update state
      dispatch(removeDraftEvent(selectedEvent.id));
    dispatch(addLiveEvent({
      ...selectedEvent,
      ...updateObj,
    }));

      setModalOpen(false);
      setSelectedEvent(null);
    } else {
      alert("Failed to update event. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Draft Events</h2>
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
          {drafts.length > 0 ? (
            drafts.map(event => (
              <li
                key={event.id}
                className="p-4 border rounded-md shadow-md cursor-pointer hover:bg-gray-100"
                onClick={() => handleDraftClick(event)} // 👈 open modal
              >
                <h3 className="text-lg font-medium">{event.name}</h3>
                <p className="text-gray-600">{event.description}</p>
              </li>
            ))
          ) : (
            <p>No draft events available.</p>
          )}
        </ul>
      )}

      {/* ✅ Modal for permission status */}
      {modalOpen && selectedEvent && (
        <Modal onClose={() => setModalOpen(false)} title="Event Permission Status">
          {isLoadingStatus ? (
            <p>Checking status...</p>
          ) : (
            <>
              {permissionStatus === "none" && (
                <>
                  <p className="text-red-500 mt-4 mb-2">Venue not given for this event.</p>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                    onClick={() => {
                      setModalOpen(false);
                      navigate(`/organizer/permissions/request`);
                    }}
                  >
                    Request Venue
                  </button>

                  <p className="blue-red-500 mt-4 mb-2">No venue needed! Simply create the event..</p>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                    onClick={() => {
                      setVenue('no venue')
                      handleCreateEvent();
                    }}
                  >
                    Create Event
                  </button>
                </>
              )}

              {permissionStatus === "pending_admin_approval" && (
                <>
                  <p className="text-yellow-600 mb-4">Venue is not yet approved!</p>
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                    disabled
                  >
                    Create Event
                  </button>
                </>
              )}

              {permissionStatus === "approved" && (
                <>
                  <p className="text-green-600 mb-4">Venue is approved!</p>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
                    onClick={handleCreateEvent}
                  >
                    Create Event
                  </button>
                </>
              )}

              {permissionStatus === "rejected" && (
                <>
                  <p className="text-red-600 mb-4">Venue Permission is rejected! You can still request different slot</p>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                    onClick={() => {
                      setModalOpen(false);
                      navigate(`/organizer/permissions/request`);
                    }}
                  >
                    Request Venue
                  </button>
                </>
              )}
            </>
          )}
        </Modal>
      )}
    </div>
  );
};

export default EventDrafts;
