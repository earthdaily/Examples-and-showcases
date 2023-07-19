import { createAsyncThunk, createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import AuthService from '@core/auth/AuthService';

export interface AuthState {
    isLoggedIn: boolean;
    inRedirection: boolean;
    loading: boolean;
    redirectionError: boolean;
    redirectionErrorMessage: string;
    token: string;
}

const initialState: AuthState = {
    isLoggedIn: false,
    inRedirection: false,
    loading: false,
    redirectionError: false,
    redirectionErrorMessage: '',
    token: '',
};

const authService = new AuthService();
export const logout = createAction('auth/logout');

export const signinRedirect = createAsyncThunk('auth/signin', async () => {
    const response = await authService.signinRedirect();
    const token = authService.isAuthenticated();
    console.log(token);
    console.log(response);
});

export const setToken = createAsyncThunk('auth/getToken', async () => {
    return authService.getToken();
});

export const signInSilent = createAsyncThunk('auth/silentRenew', async () => {
    return authService.signinSilent();
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loading: (state: AuthState, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        isLoggedIn: (state: AuthState, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signinRedirect.pending, (state) => {
                state.inRedirection = true;
            })
            .addCase(signinRedirect.fulfilled, (state) => {
                state.inRedirection = true;
            })
            .addCase(signinRedirect.rejected, (state) => {
                state.inRedirection = true;
            })
            .addCase(logout, (state) => {
                authService.logout();
                state.isLoggedIn = false;
            })
            .addCase(setToken.fulfilled, (state, action) => {
                state.token = action.payload;
            })
            .addCase(signInSilent.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(signInSilent.pending, (state) => {
                state.loading = true;
            });
    },
});

export const { loading, isLoggedIn } = authSlice.actions;

// selectors
export const selectIsLoggedIn = (state: AuthState) => state.isLoggedIn;
export const selectLoading = (state: AuthState) => state.loading;
export const selectInRedirection = (state: AuthState) => state.inRedirection;
export const selectToken = (state: AuthState) => state.token;

export default authSlice.reducer;
