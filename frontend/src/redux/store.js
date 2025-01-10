import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Asigură-te că acest import este corect

const store = configureStore({
  reducer: {
    auth: userReducer,
  }
});

export default store;
