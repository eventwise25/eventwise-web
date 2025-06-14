import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../../redux/store"
import React, { useState } from "react";
import { EventFormData } from "../../../../interface/Events";
import { updateEvent } from "../../../../services/eventService";
import { addUserParticipation } from "../../../../services/userService";
import { updateRegistration } from "../../../../services/registrationService";
import { setRegistrations } from "../../../../redux/slices/registrationSlice";

interface ResultsInfoProps {
  event?: EventFormData;
  onEventUpdate: (updatedFields: Partial<EventFormData>) => void;
}

const Results: React.FC<ResultsInfoProps> = ({ event, onEventUpdate }) => {
  const { registrations } = useSelector((state: RootState) => state.registrations);
  const [results, setResults] = useState<Record<string, number>>({});
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  console.log(registrations);

  const handleSubmitResults = async () => {
    if (!user || user.role !== 'organizer' || !event) return;

    const eventId = event.id;
    const organizerId = user.id;

    const resultArray = Object.entries(results).map(([registration_id, win_position]) => ({
      registration_id,
      win_position,
    }));

    await updateEvent(organizerId, eventId, { results: resultArray });

    // Update local event state
    onEventUpdate({ results: resultArray });

    const updatedRegistrations = await Promise.all(
      registrations.map(async (reg) => {
        const position = results[reg.id];
        const isWinner = !!position;

        for (const member of reg.member_details) {
          const participation = {
            event_id: eventId,
            is_winner: isWinner,
            certificate: "",
            ...(isWinner && { position }),
          };
          await addUserParticipation(member.user_id, participation);
        }

        // Update Firestore registration
        await updateRegistration(organizerId, eventId, reg.id, {
          is_winner: isWinner,
          ...(isWinner && { position }),
        });

        return {
          ...reg,
          is_winner: isWinner,
          ...(isWinner && { position }),
        };
      })
    );

    dispatch(setRegistrations(updatedRegistrations));

    alert("Results saved successfully.");
  };

  return (
    <div>

      {registrations.map((reg) => {
        const savedPosition = event?.results?.find(r => r.registration_id === reg.id)?.win_position;

        return (
          <div key={reg.id} className="border p-4 rounded mb-4">
            {
              event?.is_team_event ? (
                <>
                  <h2 className="font-bold">{reg.team_name || reg.user_id}</h2>
                  <p>Members: {reg.member_details?.map(m => `${m.user_name}`).join(", ")}</p>
                </>
              ) : (
                <h2 className="font-bold">{reg.member_details?.map(m => `${m.user_name} (${reg.user_id})`).join(", ")}</h2>
              )
            }

            <select
              className="mt-2 border p-1 rounded"
              value={results[reg.id] ?? savedPosition ?? ""}
              onChange={(e: any) => setResults(prev => ({ ...prev, [reg.id]: parseInt(e.target.value) }))}
            >
              <option value="">-- Select Position --</option>
              <option value="1">1st</option>
              <option value="2">2nd</option>
              <option value="3">3rd</option>
            </select>

            {savedPosition && (
              <p className="mt-1 text-sm text-green-600">Saved as: {savedPosition}{savedPosition === 1 ? "st" : savedPosition === 2 ? "nd" : "rd"} position</p>
            )}
          </div>
        );
      })}


      <button onClick={handleSubmitResults} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Submit Results
      </button>
    </div>
  )
}

export default Results