// import { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../../redux/store';
// import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaTag } from 'react-icons/fa';

// const EventDetails = () => {
// const { id } = useParams();
// const { events } = useSelector((state: RootState) => state.events);

// const [showModal, setShowModal] = useState(false);
// const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

// // Find the event by ID
// const event = events?.find(e => e.id === id);

// if (!event) {
//   return <p className="p-4 text-red-500">Event not found.</p>;
// }

// // Extract the YouTube video ID from a URL
// const extractYouTubeId = (url: string) => {
//   const match = url.match(/(?:youtube\.com\/(?:.*[?&]v=|embed\/|v\/)|youtu\.be\/)([^"&?\/\s]{11})/);
//   return match ? match[1] : null;
// };

//   return (
// <div className="p-6 max-w-4xl mx-auto bg-white border rounded-md shadow-lg">
//   <h2 className="text-3xl font-bold mb-4">{event.name || 'Not Available'}</h2>
//   <p className="text-gray-700 mb-6">{event.description || 'Not Available'}</p>

//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//     <div>
//       <div className="flex items-center mb-2">
//         <FaTag className="mr-2 text-gray-600" />
//         <span className="font-semibold">Type:</span>
//         <span className="ml-2">{event.type || 'Not Available'}</span>
//       </div>
//       <div className="flex items-center mb-2">
//         <FaMapMarkerAlt className="mr-2 text-gray-600" />
//         <span className="font-semibold">Venue:</span>
//         <span className="ml-2">{event.venue || 'Not Available'}</span>
//       </div>
//       <div className="flex items-center mb-2">
//         <FaCalendarAlt className="mr-2 text-gray-600" />
//         <span className="font-semibold">Start Date:</span>
//         <span className="ml-2">{event.start_date || 'Not Available'}</span>
//       </div>
//       <div className="flex items-center mb-2">
//         <FaClock className="mr-2 text-gray-600" />
//         <span className="font-semibold">Start Time:</span>
//         <span className="ml-2">{event.start_time || 'Not Available'}</span>
//       </div>
//     </div>
//     <div>
//       <div className="flex items-center mb-2">
//         <FaCalendarAlt className="mr-2 text-gray-600" />
//         <span className="font-semibold">End Date:</span>
//         <span className="ml-2">{event.end_date || 'Not Available'}</span>
//       </div>
//       <div className="flex items-center mb-2">
//         <FaClock className="mr-2 text-gray-600" />
//         <span className="font-semibold">End Time:</span>
//         <span className="ml-2">{event.end_time || 'Not Available'}</span>
//       </div>
//       <div className="flex items-center mb-2">
//         <FaUsers className="mr-2 text-gray-600" />
//         <span className="font-semibold">Max Participants:</span>
//         <span className="ml-2">{event.max_participants || 'Not Available'}</span>
//       </div>
//     </div>
//   </div>

//   {event.images && event.images.length > 0 && (
//     <div className="mt-8">
//       <h3 className="text-2xl font-semibold mb-4">Event Images:</h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {event.images.map((img, index) => (
//           <img
//             key={index}
//             src={img}
//             alt={`Event Image ${index + 1}`}
//             className="rounded-md shadow-md w-full h-48 object-cover"
//           />
//         ))}
//       </div>
//     </div>
//   )}

//   {event.videos && event.videos.length > 0 && (
//     <div className="mt-8">
//       <h3 className="text-2xl font-semibold mb-4">Event Videos:</h3>
//       <div className="grid grid-cols-1 gap-6">
//         {event.videos.map((videoUrl, index) => {
//           const youtubeId = extractYouTubeId(videoUrl);
//           return youtubeId ? (
//             <div key={index}>
//               <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                 onClick={() => {
//                   setSelectedVideo(youtubeId);
//                   setShowModal(true);
//                 }}
//               >
//                 Preview Video
//               </button>
//             </div>
//           ) : null;
//         })}
//       </div>
//     </div>
//   )}

//   {selectedVideo && showModal && (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
//       onClick={() => setShowModal(false)}
//     >
//       <div
//         className="bg-white rounded-lg overflow-hidden w-11/12 md:w-2/3 lg:w-1/2 shadow-lg relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-4">
//           <iframe
//             width="100%"
//             height="315"
//             src={`https://www.youtube.com/embed/${selectedVideo}`}
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//             className="rounded-md"
//           ></iframe>
//           <button
//             className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
//             onClick={() => setShowModal(false)}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   )}
// </div>
//   );
// };

// export default EventDetails;

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import EventInfo from "./EventInfo";
import Registrations from "./Registrations";
import Results from "./Results";
import Feedback from "./Feedback";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { getEventRegistrations, getUserById } from "../../../../services/registrationService";
import { UserData } from "../../../../interface/User";
import { setRegistrations } from "../../../../redux/slices/registrationSlice";
import { getEventFeedbacks } from "../../../../services/feedbackService";
import { setFeedbacks } from "../../../../redux/slices/feedbackSlice";
import { getEventById } from "../../../../services/eventService";
import { EventFormData } from "../../../../interface/Events";

const tabs = ["Event Details", "Registrations", "Results", "Feedback"];

export default function EventDashboard() {
  const [activeTab, setActiveTab] = useState("Event Details");
  const [event, setEvent] = useState<EventFormData>();
  const [loading, setLoading] = useState<Boolean>();

  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const {registrations} = useSelector((state: RootState) => state.registrations);
  const {feedbacks} = useSelector((state : RootState) => state.feedback);
  const dispatch = useDispatch();

  // Fetch all the data of Events Info, Registrations, Results, and Feedback. Store it into the state.
  useEffect(() => {
    const loadAllData = async () => {
      if (user && id) {
        setLoading(true);
        const eventData = await getEventById(user.id, id);
        if (eventData) {
          setEvent(eventData);
          await fetchRegistrationsData(eventData); // pass event explicitly
          await fetchFeedbacks(user.id, id);
        }
        setLoading(false);
      }
    };
  
    loadAllData();
  }, [user, id]);
  

  useEffect(() => {
    if(event && registrations && feedbacks){
      setLoading(false);
    }
  })

  // const fetchEvent = async (user_id: string, event_id: string) => {
  //   const eventData = await getEventById(user_id, event_id);
  //   if (eventData) {
  //     setEvent(eventData);
  //   }
  // };
  
  const fetchFeedbacks = async (user_id: string, event_id: string) => {
    if (!user || user.role !== "organizer") return;
    const data = await getEventFeedbacks(user_id, event_id);
    dispatch(setFeedbacks(data));
  };
  
  const fetchRegistrationsData = async (eventData: EventFormData) => {
    if (!user || user.role !== "organizer" || !id) return;
  
    const rawRegistrations = await getEventRegistrations(user.id, id);
  
    const enriched = await Promise.all(
      rawRegistrations.map(async (reg) => {
        const allMembers = eventData.is_team_event
          ? [reg.user_id, ...(reg.members || []).map((m) => m.id)]
          : [reg.user_id];
  
        const member_details = await Promise.all(
          allMembers.map(async (memId: string) => {
            const user = await getUserById(memId);
            return user;
          })
        );
  
        return {
          ...reg,
          member_details: member_details.filter(
            (u): u is UserData => u !== null
          ),
        };
      })
    );
  
    dispatch(setRegistrations(enriched));
  };
  
  console.log(id);

  const handleEventUpdate = (updatedFields: Partial<EventFormData>) => {
    setEvent((prev) => prev ? { ...prev, ...updatedFields } : prev);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Event Details":
        return <EventInfo event={event} />;
      case "Registrations":
        return <Registrations event={event} />;
      case "Results":
        return <Results event={event} onEventUpdate={handleEventUpdate} />;
      case "Feedback":
        return <Feedback event={event} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-5 bg-white rounded-2xl shadow-lg">
      <div className="border-b flex justify-between px-6 pt-4">
        <h2 className="text-2xl font-semibold my-2">Event Dashboard</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b mt-2 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 font-medium border-b-2 cursor-pointer ${activeTab === tab
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-blue-600"
              } transition duration-300`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-6 py-4">
        {loading ? (
          <div className="text-center text-lg font-semibold text-gray-600">
            Loading data, please wait...
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </div>
  );
}

