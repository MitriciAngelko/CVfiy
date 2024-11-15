import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Asigură-te că acest import este corect

const store = configureStore({
  reducer: {
    auth: userReducer // Asigură-te că reducer-ul pentru auth este corect configurat
  }
});

export default store;
