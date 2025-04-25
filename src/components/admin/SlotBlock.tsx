type Props = {
    slot: any;
    onClick: (slot: any) => void;
  };
  
  type PermissionStatus = "approved" | "rejected" | "pending_admin_approval" | "waiting";
  
  const statusColors: Record<PermissionStatus, string> = {
    approved: "bg-green-200",
    rejected: "bg-red-200",
    pending_admin_approval: "bg-yellow-200",
    waiting: "bg-gray-200",
  };

  const formatTime = (time: string) => {
    let hour = parseInt(time.substring(0, 2));
    let suffix = hour >= 12 ? "pm" : "am";
    hour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour}${time.substring(2)} ${suffix}`;
  };
  
  export default function SlotBlock({ slot, onClick }: Props) {
    const status = slot.status as PermissionStatus;
    const statusColor = statusColors[status] || "bg-white"; // fallback just in case
  
    return (
      <div
        className={`p-4 rounded shadow cursor-pointer ${statusColor}`}
        onClick={() => onClick(slot)}
      >
        <p className="font-semibold">Event: {slot.event?.name || slot.event_id}</p>
        <p>Organizer: {slot.organizer_id}</p>
        <p>
          start date : {slot.requested_slot.start_date} <br/>
          end date : {slot.requested_slot.end_date} <br/>
          start time : {formatTime(slot.requested_slot.start_time)} <br/>
          end time : {formatTime(slot.requested_slot.end_time)}<br/>
        </p>
        <p className="text-sm italic">Status: {status}</p>
      </div>
    );
  }
  