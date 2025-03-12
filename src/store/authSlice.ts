import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

interface User {
  email: string;
  isAdmin: boolean;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Also store token in localStorage for API calls
      if (action.payload.token) {
        localStorage.setItem('authToken', action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
    }
  }
});

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated']
};

export const { setUser, logout } = authSlice.actions;
const reducer = persistReducer(persistConfig, authSlice.reducer);
export default reducer;