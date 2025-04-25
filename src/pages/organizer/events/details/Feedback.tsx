import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { EventFormData } from "../../../../interface/Events";
import { fetchFeedbackSuggestions, FeedbackSuggestion } from "../../../../services/feedbackService";
import FeedbackModal from "../../../../components/modal/FeedbackModal";

interface FeedbackInfoProps {
  event?: EventFormData;
}

const Feedback: React.FC<FeedbackInfoProps> = ({ event }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const feedbacks = useSelector((state: RootState) => state.feedback.feedbacks);
  const [modalOpen, setModalOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<FeedbackSuggestion | null>(null);

  const handleFeedbackClick = async () => {
    if (!event?.id || !user?.id) return;
    const result = await fetchFeedbackSuggestions(event.id, user.id);
    setSuggestion(result);
    setModalOpen(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Feedback for {event?.name}</h2>

      {feedbacks.length === 0 ? (
        <p>No feedback for this event!</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((f, idx) => (
            <div
              key={idx}
              className="border p-3 rounded shadow cursor-pointer hover:bg-gray-100"
              onClick={handleFeedbackClick}
            >
              <p className="mt-1">{f.feedback}</p>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <FeedbackModal suggestion={suggestion} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default Feedback;
