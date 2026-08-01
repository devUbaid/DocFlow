import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/slices/auth/reducer';
import uiReducer from '@/slices/ui/reducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

export default store;
