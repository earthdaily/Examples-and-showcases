import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomQueryString, get } from '@core/utils/DomainManagementHelper';
import { RootState } from '@core/store/store';
import { SeasonFieldsResponse } from '@core/models/geosys/SeasonFieldResponse';

export interface SeasonFieldState {
    seasonFields: SeasonFieldsResponse;
    selectedSeasonField: string;
}

const initialState: SeasonFieldState = {
    seasonFields: [],
    selectedSeasonField: '',
};

export const getSeasonFields = createAsyncThunk('seasonFields/getall', async (growerId: string) => {
    const url = process.env.G6_API_DOMAIN_MANAGEMENT_URL;
    const fields = [
        'id',
        'geometry',
        'centroid',
        'acreage',
        'field.name',
        'crop.id',
        'crop.name',
        'field.farm.id',
        'field.farm.grower.id',
        'sowingDate',
        'cropUsage.id',
        'cropUsage.name',
    ];

    const queryString = [{ name: 'Field.Farm.Grower.Id', value: growerId }] as CustomQueryString[];
    const response = await get<SeasonFieldsResponse>(url, 'seasonfields', '10', fields, queryString);
    return response.data;
});

const seasonFieldSlice = createSlice({
    name: 'seasonFields',
    initialState,
    reducers: {
        selectedSeasonFieldId: (state: SeasonFieldState, action: PayloadAction<string>) => {
            state.selectedSeasonField = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getSeasonFields.fulfilled, (state, action) => {
            state.seasonFields = action.payload;
        });
    },
});

export const { selectedSeasonFieldId } = seasonFieldSlice.actions;

export const selectSeasonFields = (state: RootState) => state.seasonField.seasonFields;
export const selectSelectedSeasonFieldId = (state: RootState) => state.seasonField.selectedSeasonField;

export default seasonFieldSlice.reducer;
