type Props = {
    slot: any;
    onClose: () => void;
    onApprove: () => void;
    onReject: () => void;
  };
  
  export default function SlotDetailsModal({
    slot,
    onClose,
    onApprove,
    onReject,
  }: Props) {
    const { event, resource, requested_slot } = slot;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-[500px] shadow-xl relative space-y-4">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            ✕
          </button>
  
          <h2 className="text-xl font-semibold">Permission Request Details</h2>
  
          {/* Event Info */}
          <div>
            <h3 className="font-medium">Event Info</h3>
            <p><strong>Title:</strong> {event?.name}</p>
            <p><strong>Description:</strong> {event?.description}</p>
            <p><strong>Department:</strong> {event?.department}</p>
            <p>
              <strong>Date:</strong> ({requested_slot.start_date}) - ({requested_slot.end_date})
            </p>
            <p>
              <strong>Timing:</strong> {requested_slot.start_time} - {requested_slot.end_time}
            </p>
            {event?.images?.[0] && (
              <img
                src={event.images[0]}
                alt="Event"
                className="w-full h-40 object-cover mt-2 rounded"
              />
            )}
          </div>
  
          {/* Resource Info */}
          <div>
            <h3 className="font-medium">Resource Info</h3>
            <p><strong>Resource:</strong> {resource?.name}</p>
            <p><strong>Type:</strong> {resource?.type}</p>
            <p><strong>Department:</strong> {resource?.department}</p>
          </div>
  
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onApprove}
              className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Approve
            </button>
            <button
              onClick={onReject}
              className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  }
  