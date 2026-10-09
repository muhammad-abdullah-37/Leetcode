import { createAsyncThunk, createSlice}  from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient';

// User Registeration
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData,{rejectWithValue}) => {
        try {
            const response =  await axiosClient.post('/user/register',userData);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// User Login
export const loginUser = createAsyncThunk(
    'auth/login',
    async(credentials, {rejectWithValue}) => {
        try {
            const response = await axiosClient.post('/user/login',credentials);
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error)          
        }
    }
);
// User Authentication
export const checkAuth = createAsyncThunk(
    'auth/check',
    async(_, {rejectWithValue}) => {
        try {
            const {data} = await axiosClient.get('/user/check');
            return data.user;
        } catch (error) {
            return rejectWithValue(error)
        }
    }
);

// User Logout
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async(_, {rejectWithValue}) => {
        try {
            await axiosClient.post('/logout');
            return null
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

// Authenication Slice
const authSlice = createSlice({
    name : 'auth',
    initialState: {
        user : null,
        isAuthencated : false,
        loading : false,
        error: null
    },
    reducers : {
    },
    extraReducers: (builder) => {
        builder 
        //  Register user cases
        .addCase(registerUser.pending,(state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state,action) => {
            state.loading = false;
            state.isAuthencated = !!action.payload; 
            state.user = action.payload;
        })
        .addCase(registerUser.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload?.message || 'Something Went Wrong';
            state.isAuthencated=false;
            state.user=null;
        })

        // Login user cases
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error= null
        })
        .addCase(loginUser.fulfilled,(state,action) => {
            state.loading=false;
            state.isAuthencated=!!action.payload;
            state.user= action.payload;
        })
        .addCase(loginUser.rejected,(state,action) => {
            state.loading = false;
            state.error= action.payload?.message || 'Something Went Wrong';
            state.isAuthencated=false;
            state.user=null;
        })

        // Check Auth Cases
        .addCase(checkAuth.pending, (state) => {
            state.loading= true;
            state.error=null
        })
        .addCase(checkAuth.fulfilled,(state,action) => {
            state.loading=false;
            state.isAuthencated= !!action.payload;
            state.user=action.payload

        }) 
        .addCase(checkAuth.rejected,(state,action) => {
            state.loading=false;
            state.error=action.payload?.message || 'Something Went Wrong';
            state.isAuthencated=false;
            state.user=null
        })

        // Logout Cases
        .addCase(logoutUser.pending,(state) => {
            state.loading=true;
            state.error=null
        })
        .addCase(logoutUser.fulfilled,(state) => {
            state.loading=false;
            state.user=null;
            state.isAuthencated=false;
            state.error=null
        })
        .addCase(logoutUser.rejected,(state,action) => {
            state.loading=false;
            state.error=action.payload?.message || 'Something Went Wrong';
            state.isAuthencated=false;
            state.user=null
        })
    }
});

export default authSlice.reducer;