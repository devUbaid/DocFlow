import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiLogin, apiRegister, apiGetMe } from '@/helpers/api';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      return await apiLogin(data);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      return await apiRegister(data);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const loadMeThunk = createAsyncThunk(
  'auth/loadMe',
  async (_, { rejectWithValue }) => {
    try {
      return await apiGetMe();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);
