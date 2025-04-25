import React from "react";

interface EventProps {
  name: string;
  type: string;
  start_date: string;
  venue: string;
  prizes: Record<string, number>;
  goodies: string[];
}

const EventCard: React.FC<EventProps> = ({ name, type, start_date, venue, prizes, goodies }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-sm text-gray-600">{type}</p>
      <p className="text-sm">📅 {start_date}</p>
      <p className="text-sm">📍 {venue}</p>
      <p className="text-sm font-bold">🏆 Prizes:</p>
      <ul className="text-sm">
        {Object.entries(prizes).map(([position, amount]) => (
          <li key={position}>🥇 {position} - ₹{amount}</li>
        ))}
      </ul>
      {goodies.length > 0 && (
        <>
          <p className="text-sm font-bold mt-2">🎁 Goodies:</p>
          <ul className="text-sm">
            {goodies.map((item, index) => (
              <li key={index}>🎉 {item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default EventCard;
