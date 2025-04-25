import React from "react";
import { FeedbackSuggestion } from "../../services/feedbackService";

interface FeedbackModalProps {
  suggestion: FeedbackSuggestion | null;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ suggestion, onClose }) => {
  if (!suggestion) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Feedback Suggestions</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">×</button>
        </div>

        <p className="mb-2"><strong>Event:</strong> {suggestion.event_name}</p>
        <p className="mb-4"><strong>Overall Sentiment:</strong> {suggestion.summary.overall_sentiment}</p>

        <div className="mb-3">
          <h3 className="font-semibold">Noteworthy Quotes:</h3>
          <ul className="list-disc pl-5 text-sm">
            {suggestion.noteworthy_quotes.map((quote, i) => (
              <li key={i}>{quote}</li>
            ))}
          </ul>
        </div>

        <div className="mb-3">
          <h3 className="font-semibold">What Went Well:</h3>
          <ul className="list-disc pl-5 text-sm">
            {suggestion.summary.what_went_well.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-3">
          <h3 className="font-semibold">Areas for Improvement:</h3>
          <ul className="list-disc pl-5 text-sm">
            {suggestion.summary.areas_for_improvement.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Common Themes:</h3>
          <ul className="list-disc pl-5 text-sm">
            {suggestion.summary.common_themes.map((theme, i) => (
              <li key={i}>{theme}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
