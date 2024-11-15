import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../firebase';

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Get user information and return only the necessary data (not the whole user object)
      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,  // if applicable
      };

      console.log('Token:', await userCredential.user.getIdToken());

      return user;  // Return only the user data you need
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Slice-ul de utilizator
// userSlice.js
const userSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});


export const { logout, setUser } = userSlice.actions;

export default userSlice.reducer;