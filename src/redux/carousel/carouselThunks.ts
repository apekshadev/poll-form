
import { createAsyncThunk } from '@reduxjs/toolkit';
const POLL_URL = "https://6597e071668d248edf23975c.mockapi.io/surveys/v1/polls";

export const submitSummaryData = createAsyncThunk(
  'carousel/submitSummaryData',
  async (summaryData: { question: string; answer: string }[]) => {
    try {
      const formattedData = summaryData.map(({ question, answer }) => ({
        question,
        answer,
      }));

      const response = await fetch(POLL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pollQuestions: formattedData }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit summary data');
      }
      const successMessage = 'Polls Summary submitted successfully';
      return successMessage;
    } catch (error:any) {
      console.error('Error submitting summary data:', error.message);
      throw error;
    }
  }
);
