import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedbackData } from "../../interface/Feedback";

interface FeedbackState {
  feedbacks: FeedbackData[];
}

const initialState: FeedbackState = {
  feedbacks: [],
};

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setFeedbacks: (state, action: PayloadAction<FeedbackData[]>) => {
      state.feedbacks = action.payload;
    },
  },
});

export const { setFeedbacks } = feedbackSlice.actions;
export default feedbackSlice.reducer;
