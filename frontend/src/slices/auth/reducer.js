import { createSlice } from '@reduxjs/toolkit';
import { loginThunk, registerThunk, loadMeThunk } from './thunk';

const token = localStorage.getItem('token');

const initialState = {
  token: token || null,
  user: null,
  status: 'idle',
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handleAuth = (state, { payload }) => {
      state.status = 'succeeded';
      state.token = payload.token;
      state.user = payload.user;
      state.error = null;
      localStorage.setItem('token', payload.token);
    };

    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, handleAuth)
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })
      .addCase(registerThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, handleAuth)
      .addCase(registerThunk.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })
      .addCase(loadMeThunk.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.initialized = true;
      })
      .addCase(loadMeThunk.rejected, (state) => {
        state.token = null;
        state.user = null;
        state.initialized = true;
        localStorage.removeItem('token');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
