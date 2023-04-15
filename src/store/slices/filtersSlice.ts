import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  priceFilter: [0, 0],
  serviceTypeFilter: '',
  reviewFilter: 0,
  minCoords: {},
  maxCoords: {},
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPriceFilterMin: (state, action) => {
      state.priceFilter[0] = action.payload;
    },
    setPriceFilterMax: (state, action) => {
      state.priceFilter[1] = action.payload;
    },
    setServiceTypeFilter: (state, action) => {
      state.serviceTypeFilter = action.payload;
    },
    setReviewFilter: (state, action) => {
      state.reviewFilter = action.payload;
    },
    setMinCoords: (state, action) => {
      state.minCoords = action.payload;
    },
    setMaxCoords: (state, action) => {
      state.maxCoords = action.payload;
    },
  },
});

export const {
  setPriceFilterMin,
  setPriceFilterMax,
  setServiceTypeFilter,
  setReviewFilter,
  setMinCoords,
  setMaxCoords,
} = filtersSlice.actions;

export default filtersSlice.reducer;
