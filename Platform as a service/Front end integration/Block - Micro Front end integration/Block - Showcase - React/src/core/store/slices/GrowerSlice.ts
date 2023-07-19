import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { get } from '@core/utils/DomainManagementHelper';
import { Grower } from '@core/models/geosys/Grower';
import { RootState } from '@core/store/store';

export interface GrowerState {
    growers: Grower[];
    selectedGrowerId: string;
}

const initialState: GrowerState = {
    growers: [],
    selectedGrowerId: '',
};

export const getGrowers = createAsyncThunk('growers/getall', async () => {
    try {
        const url = process.env.G6_API_DOMAIN_MANAGEMENT_URL;
        const fields = ['Address.city', 'companyName', 'firstName', 'lastName', 'id', 'login', 'email'];
        const response = await get<Grower[]>(url, 'users', '10', fields);
        return response.data;
    } catch (e) {
        console.error(e);
    }
});

const growerSlice = createSlice({
    name: 'growers',
    initialState,
    reducers: {
        selectedGrowerId: (state: GrowerState, action: PayloadAction<string>) => {
            state.selectedGrowerId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getGrowers.fulfilled, (state, action) => {
            state.growers = action.payload;
        });
        builder.addCase(getGrowers.rejected, (state, action) => {
            try {
                console.error(action.payload);
            } catch (error) {
                console.error(error);
            }
        });
    },
});

export const { selectedGrowerId } = growerSlice.actions;

export const selectGrowers = (state: RootState) => state.grower.growers;
export const selectSelectedGrowerId = (state: RootState) => state.grower.selectedGrowerId;

export default growerSlice.reducer;
