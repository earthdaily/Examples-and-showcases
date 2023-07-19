export interface FieldResponse {
    name: string;
    farm: FarmResponse;
}

export interface FarmResponse {
    id: string;
    grower: GrowerResponse;
}

export interface GrowerResponse {
    id: string;
}

export interface CropResponse {
    id: string;
    name: string;
}

export interface CropUsageResponse {
    id: string;
    name: string;
}

export interface SeasonFieldResponse {
    id: string;
    field: FieldResponse;
    crop: CropResponse;
    cropUsage: CropUsageResponse;
    isIrrigated: boolean;
    sowingDate: Date;
    acreage: number;
    geometry?: string;
    centroid?: string;
}

export type SeasonFieldsResponse = Array<SeasonFieldResponse>;
