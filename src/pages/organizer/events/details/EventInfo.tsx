import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaUsers,
    FaTags,
    FaBuilding,
    FaLaptop,
    FaInfoCircle,
} from 'react-icons/fa';
import { EventFormData } from '../../../../interface/Events';

interface EventInfoProps {
    event?: EventFormData;
}

const EventInfo: React.FC<EventInfoProps> = ({ event }) => {
    if (!event) {
        return <p className="p-4 text-red-500">Event not found.</p>;
    }

    const extractYouTubeId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/(?:.*[?&]v=|embed\/|v\/)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : null;
    };

    const formatTime = (time: string) => {
        let hour = parseInt(time.substring(0, 2));
        let suffix = hour >= 12 ? "pm" : "am";
        hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${hour}${time.substring(2)} ${suffix}`;
    };

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white border rounded-md shadow-lg">
            <h2 className="text-4xl font-bold mb-4 text-center">{event.name || 'Not Available'}</h2>
            <p className="text-gray-700 mb-6 text-center">{event.description || 'Not Available'}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex items-center mb-2">
                        <FaTags className="mr-2 text-gray-600" />
                        <span className="font-semibold">Type:</span>
                        <span className="ml-2">{event.type || 'Not Available'}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <FaMapMarkerAlt className="mr-2 text-gray-600" />
                        <span className="font-semibold">Venue:</span>
                        <span className="ml-2">{event.venue || 'Not Available'}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <FaBuilding className="mr-2 text-gray-600" />
                        <span className="font-semibold">Department:</span>
                        <span className="ml-2">{event.department || 'Not Available'}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <FaLaptop className="mr-2 text-gray-600" />
                        <span className="font-semibold">Mode:</span>
                        <span className="ml-2">{event.mode || 'Not Available'}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <FaInfoCircle className="mr-2 text-gray-600" />
                        <span className="font-semibold">Status:</span>
                        <span className="ml-2">{event.status || 'Not Available'}</span>
                    </div>
                </div>
                <div>
                    <div className="flex items-center mb-2">
                        <FaCalendarAlt className="mr-2 text-gray-600" />
                        <span className="font-semibold">Start Date:</span>
                        <span className="ml-2">{event.start_date || 'Not Available'}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <FaClock className="mr-2 text-gray-600" />
                        <span className="font-semibold">Start Time:</span>
                        <span className="ml-2">{formatTime(event.start_time) || 'Not Available'}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <FaCalendarAlt className="mr-2 text-gray-600" />
                        <span className="font-semibold">End Date:</span>
                        <span className="ml-2">{event.end_date || 'Not Available'}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <FaClock className="mr-2 text-gray-600" />
                        <span className="font-semibold">End Time:</span>
                        <span className="ml-2">{formatTime(event.end_time) || 'Not Available'}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <FaCalendarAlt className="mr-2 text-gray-600" />
                        <span className="font-semibold">Registration Deadline:</span>
                        <span className="ml-2">{event.registration_deadline || 'Not Available'}</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <FaUsers className="mr-2 text-gray-600" />
                        <span className="font-semibold">Max Participants:</span>
                        <span className="ml-2">{event.max_participants || 'Not Available'}</span>
                    </div>
                </div>
            </div>

            {event.images && event.images.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold mb-4 text-center">Event Images</h3>
                    <div className="flex flex-wrap justify-center gap-6">
                        {event.images.map((img, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                            >
                                <img
                                    src={img}
                                    alt={`Event Image ${index + 1}`}
                                    className="w-full h-72 object-cover transform hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {event.videos && event.videos.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-2xl font-semibold mb-4 text-center">Event Videos</h3>
                    <div className="flex flex-wrap justify-center gap-6">
                        {event.videos.map((url, index) => {
                            const videoId = extractYouTubeId(url);
                            return (
                                <div
                                    key={index}
                                    className="w-full sm:w-[450px] aspect-video rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                                >
                                    {videoId ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            title={`YouTube video ${index + 1}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="rounded-lg"
                                        />
                                    ) : (
                                        <p className="text-red-500 text-center">Invalid YouTube URL</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {event.prizes && Object.keys(event.prizes).length > 0 && (
                <div className="mt-10">
                    <h3 className="text-2xl font-semibold mb-4 text-center">Prizes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center text-center">
                        {Object.entries(event.prizes).map(([position, amount], index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-yellow-100 to-yellow-300 p-4 rounded-lg shadow-md"
                            >
                                <p className="text-lg font-bold">Position {position}</p>
                                <p className="text-gray-700 mt-2">₹ {amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {event.goodies && event.goodies.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-2xl font-semibold mb-4 text-center">Goodies</h3>
                    <ul className="list-disc list-inside text-center">
                        {event.goodies.map((item, index) => (
                            <li key={index} className="text-gray-700">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {event.results && event.results.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-2xl font-semibold mb-4 text-center">Results</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 rounded-lg">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b">Team ID</th>
                                    <th className="py-2 px-4 border-b">Position</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.results.map((result, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="py-2 px-4 border-b">{result.registration_id}</td>
                                        <td className="py-2 px-4 border-b">{result.win_position}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventInfo;
