import React, { useEffect, useState } from "react";
import { findNearestAvailableSlot } from "../../../services/slotCalculations";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { TimeSlot } from '../../../interface/Resources'
import { useDispatch } from "react-redux";
import { fetchEventsByOrganizer } from "../../../redux/slices/eventSlice";
import { fetchAllResources } from "../../../redux/slices/resourceSlice";
import { requestResourcePermission } from "../../../services/permissionsService";
import { useNavigate } from "react-router";

const RequestPermission = () => {
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [alternativeResources, setAlternativeResources] = useState<any[]>([]);
  const [adminId, setAdminId] = useState<string>("");
  const [requestDetails, setRequestDetails] = useState({
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { user } = useSelector((state: RootState) => state.auth);
  const { drafts } = useSelector((state: RootState) => state.events);
  const { resources } = useSelector((state: RootState) => state.resources);

  useEffect(() => {

    if (user?.id) {
      dispatch(fetchEventsByOrganizer(user.id) as any);
    }

    if (user?.role === 'organizer') {
      dispatch(fetchAllResources(user.college_id) as any);
    }

  }, [user, dispatch]);

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEvent(e.target.value);
  };

  const handleResourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedResource(value);
    const resource = resources.find((r) => r.id === value);
    if (resource) {
      setAdminId(resource.adminId);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequestDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleFindSlots = async () => {
    if (!selectedResource || !requestDetails.startDate || !requestDetails.endDate || !requestDetails.startTime || !requestDetails.endTime) {
      alert("Please fill all required fields.");
      return;
    }

    if (!user || user.role !== 'organizer') {
      return;
    }

    console.log("Finding slots");
    const response = await findNearestAvailableSlot(
      requestDetails.startTime,
      requestDetails.endTime,
      selectedResource,
      requestDetails.startDate,
      requestDetails.endDate,
      user.college_id
    );

    console.log(response.suggested_slots);
    console.log(response.alternative_resources);
    if (response.suggested_slots) {
      setAvailableSlots(response.suggested_slots);
    }
    else {
      setAvailableSlots([]);
    }

    if (response.alternative_resources) {
      setAlternativeResources(response.alternative_resources);
    }
    else {
      setAlternativeResources([]);
    }
  };

  const formatTime = (time: string) => {
    let hour = parseInt(time.substring(0, 2));
    let suffix = hour >= 12 ? "pm" : "am";
    hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour}${time.substring(2)} ${suffix}`;
  };


  // Permissions Object
  // export interface Permission {
  //   id: string;
  //   event_id: string;
  //   organizer_id: string;
  //   resource_id: string;
  //   requested_slot: {
  //     date: string;
  //     start_time: string;
  //     end_time: string;
  //   };
  //   status: "pending_admin_approval" | "approved" | "rejected" | "none";
  //   queue_position: number;
  // }

  const requestPermission = async () => {
    console.log("Permission request initiated");

    if (!selectedEvent || !selectedResource || !requestDetails.startDate || !requestDetails.startTime) {
      console.error("Missing required fields");
      alert("Please select an event, resource, and fill all required fields.");
      return;
    }

    if(!user || user.role !== 'organizer') {
      alert("Access Denined!");
      return;
    }

    console.log(selectedResource);
    console.log(adminId);

    const permission = {
      event_id: selectedEvent,
      organizer_id: user?.id || "", // Ensure organizer_id is not undefined
      resource_id: selectedResource,
      admin_id: adminId,
      requested_slot: {
        start_date: requestDetails.startDate,
        end_date: requestDetails.endDate,
        start_time: requestDetails.startTime,
        end_time: requestDetails.endTime,
      },
      status: "pending_admin_approval",
    };

    console.log("Permission Data:", permission);

    try {
      await requestResourcePermission(user.college_id, user.id, selectedEvent, permission);
      alert("Permission request sent successfully!");
      console.log("Permission request sent successfully!");
      navigate('/organizer/events/create');
    } catch (error) {
      alert("Error requesting permission");
      console.error("Error requesting permission:", error);
      alert("Failed to submit request.");
    }
  };


  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Request Resource Permission</h2>

      {/* Select Event */}
      <label className="text-gray-600 text-md mb-2 block">Select Event</label>
      <select onChange={handleEventChange} className="bg-gray-100 w-full px-4 py-3 rounded mb-4">
        <option value="">Select an Event</option>
        {drafts.map((event) => (
          <option key={event.id} value={event.id}>{event.name}</option>
        ))}
      </select>

      {/* Select Resource */}
      <label className="text-gray-600 text-md mb-2 block">Select Venue</label>
      <select onChange={handleResourceChange} className="bg-gray-100 w-full px-4 py-3 rounded mb-4">
        <option value="">Select a Resource</option>
        {resources.map(resource => (
          <option key={resource.id} value={resource.id}>{resource.name}</option>
        ))}
      </select>

      {/* Request Slot */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-gray-600 text-md mb-2 block">Select Start Date</label>
          <input type="date" name="startDate" value={requestDetails.startDate} onChange={handleChange} className="bg-gray-100 w-full px-4 py-3 rounded" />
        </div>
        <div>
          <label className="text-gray-600 text-md mb-2 block">Select End Date</label>
          <input type="date" name="endDate" value={requestDetails.endDate} onChange={handleChange} className="bg-gray-100 w-full px-4 py-3 rounded" />
        </div>
        <div>
          <label className="text-gray-600 text-md mb-2 block">Select Start Time</label>
          <input type="time" name="startTime" value={requestDetails.startTime} onChange={handleChange} className="bg-gray-100 px-4 w-full py-3 rounded" />
        </div>
        <div>
          <label className="text-gray-600 text-md mb-2 block">Select End Time</label>
          <input type="time" name="endTime" value={requestDetails.endTime} onChange={handleChange} className="bg-gray-100 px-4 py-3 w-full rounded" />
        </div>
      </div>

      {/* Find Available Slots Button */}
      <button onClick={handleFindSlots} className="mb-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
        Find Available Slots
      </button>

      {/* Suggested Time Slots */}
      {availableSlots.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Suggested Time Slots</h3>
          <div className="grid p-5 grid-cols-3 gap-5">
            {(() => {
              const requestedSlot = {
                start_date: requestDetails.startDate,
                end_date: requestDetails.endDate,
                start_time: requestDetails.startTime,
                end_time: requestDetails.endTime,
              };

              // Find index of requested slot
              const matchIndex = availableSlots.findIndex(
                slot =>
                  slot.start_date === requestedSlot.start_date &&
                  slot.end_date === requestedSlot.end_date &&
                  slot.start_time === requestedSlot.start_time &&
                  slot.end_time === requestedSlot.end_time
              );

              // Move requested slot to top if it exists
              const orderedSlots = matchIndex !== -1
                ? [availableSlots[matchIndex], ...availableSlots.filter((_, i) => i !== matchIndex)]
                : availableSlots;

              return orderedSlots.map((slot, index) => {
                const isRequested =
                  slot.start_date === requestedSlot.start_date &&
                  slot.end_date === requestedSlot.end_date &&
                  slot.start_time === requestedSlot.start_time &&
                  slot.end_time === requestedSlot.end_time;

                return (
                  <div
                    key={index}
                    className={`text-gray-700 p-5 border-2 text-center rounded-md transition-all ${isRequested
                        ? "border-green-500 bg-green-50 shadow-lg"
                        : "border-gray-300"
                      }`}
                  >
                    {isRequested && (
                      <p className="text-green-700 font-semibold mb-2">✅ Requested slot available</p>
                    )}
                    <p>start date: {slot.start_date}</p>
                    <p>end date: {slot.end_date}</p>
                    <p>start time: {formatTime(slot.start_time)}</p>
                    <p>end time: {formatTime(slot.end_time)}</p>
                    <button
                      onClick={requestPermission}
                      className="px-4 py-2 text-md rounded-full font-bold text-gray-500 border-2 bg-transparent hover:bg-gray-50 transition-all ease-in-out duration-300 cursor-pointer my-3"
                    >
                      Request permission
                    </button>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}


      {/* Alternative Resources */}
      {alternativeResources.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Alternative Resources</h3>
          <ul className="list-disc pl-5">
            {alternativeResources.map((resource, index) => (
              <li key={index} className="text-gray-700">
                {resource.name}: {resource.available_slot.start_date} {resource.available_slot.start_time} - {resource.available_slot.end_time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RequestPermission;
