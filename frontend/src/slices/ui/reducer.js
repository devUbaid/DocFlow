import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast(state, { payload }) {
      state.toast = {
        id: Date.now(),
        type: payload.type || 'info',
        message: payload.message,
      };
    },
    dismissToast(state) {
      state.toast = null;
    },
  },
});

export const { showToast, dismissToast } = uiSlice.actions;
export default uiSlice.reducer;
