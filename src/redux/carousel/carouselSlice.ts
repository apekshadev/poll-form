import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { submitSummaryData } from './carouselThunks';
interface Option {
  name: string;
  icon: string;
}

interface Slide {
  question?: string;
  options?: Option[];
  summary?: boolean;
}

interface CarouselState {
  slides: Slide[];
  currentSlide: number;
  userSelections: { [key: number]: string };
  successMessage: string | null;
}

const initialState: CarouselState = {
  slides: [],
  currentSlide: 0,
  userSelections: {},
  successMessage:null,
};



export const carouselSlice = createSlice({
  name: 'carousel',
  initialState,
  reducers: {
    setSlides: (state, action: PayloadAction<Slide[]>) => {
      state.slides = action.payload;
    },
    setCurrentSlide: (state, action: PayloadAction<number>) => {
      state.currentSlide = action.payload;
    },
    setUserSelections: (state, action: PayloadAction<{ [key: number]: string }>) => {
      state.userSelections = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(submitSummaryData.fulfilled, (state, action: PayloadAction<string>) => {
      state.successMessage = action.payload;
    });
  },
});

export const { setSlides, setCurrentSlide, setUserSelections } = carouselSlice.actions;
export const selectSuccessMessage = (state :RootState) => state.carousel.successMessage;
export const selectSlides = (state: RootState) => state.carousel.slides;
export const selectCurrentSlide = (state: RootState) => state.carousel.currentSlide;
export const selectUserSelections = (state: RootState) => state.carousel.userSelections;


export default carouselSlice.reducer;
