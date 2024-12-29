import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {USER_URL} from "@/utils/api";
import {User} from "@/models/User";
import {RootState} from "@/store/Store.ts";

const PREFIX = "users";

export const fetchUser = createAsyncThunk(
    `${PREFIX}/fetchUser`,
    async (_, {rejectWithValue, getState}) => {
        const state = getState() as RootState;
        const uid = state.users.currentUid;

        if (!uid) {
            return rejectWithValue("No user ID provided");
        }

        try {
            const response = await axios.get(`${USER_URL}/${uid}`);
            return response.data;
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : "Failed to fetch current user";
            return rejectWithValue(errorMessage);
        }
    }
);

export const editUser = createAsyncThunk(
    `${PREFIX}/editUser`,
    async (
        {userId, userData}: { userId: string; userData: { displayName: string; photoURL: string } },
        {rejectWithValue}
    ) => {
        try {
            const response = await axios.put(`${USER_URL}/${userId}`, userData);
            return response.data; // Return the updated user data
        } catch (error) {
            const errorMessage =
                axios.isAxiosError(error) && error.response?.data
                    ? error.response.data
                    : "Failed to update user data";
            return rejectWithValue(errorMessage);
        }
    }
);

export const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null as User | null,
        currentUid: null as string | null,
        fetchStatus: "idle",
        fetchError: null as string | null,
        editStatus: "idle",
        editError: null as string | null,
    },
    reducers: {
        setCurrentUid: (state, action) => {
            state.currentUid = action.payload;
            state.fetchStatus = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch user cases
            .addCase(fetchUser.pending, (state) => {
                state.fetchStatus = "loading";
                state.fetchError = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.fetchStatus = "succeeded";
                state.currentUser = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.fetchStatus = "failed";
                state.fetchError = (action.payload as string) || "Failed to fetch user";
            })

            // Edit user cases
            .addCase(editUser.pending, (state) => {
                state.editStatus = "loading";
                state.editError = null;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.editStatus = "succeeded";
                state.currentUser = action.payload;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.editStatus = "failed";
                state.editError = (action.payload as string) || "Failed to update user";
            });
    },
});

export const {setCurrentUid} = userSlice.actions;

export default userSlice.reducer;