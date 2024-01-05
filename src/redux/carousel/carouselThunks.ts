
import { createAsyncThunk } from '@reduxjs/toolkit';

export const submitSummaryData = createAsyncThunk(
  'carousel/submitSummaryData',
  async (summaryData: { question: string; answer: string }[]) => {
    try {
      const formattedData = summaryData.map(({ question, answer }) => ({
        question,
        answer,
      }));

      const response = await fetch('https://6597e071668d248edf23975c.mockapi.io/surveys/v1/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pollQuestions: formattedData }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit summary data');
      }
      console.log('Summary data submitted successfully');
    } catch (error:any) {
      console.error('Error submitting summary data:', error.message);
      throw error;
    }
  }
);
