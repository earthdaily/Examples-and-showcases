/** Contract from TSV MFE */
export interface TSVConfigureEvent {
  remoteUrl?: string;
  token: string;
  spatialUnits: SpatialUnit[];
  yearsOfHistory: number;
  timeframe: Timeframe;
  culture: string;
  graphConfigurations?: TSVGraphConfiguration[];
  selectedLegends?: string[];

  gddCustom?: GddCustomDegrees;
  graphDataTimeRange?: number;
}

export interface SpatialUnit {
  type: SpatialUnitType;
  value: string;
  block?: {
    id: number;
    code: string;
    idPixelType: number;
  };
  /** EPSG must be 3857 */
  centroid: string;
  name: string;
}

export interface Timeframe {
  start: Date;
  end: Date;
}

export enum SpatialUnitType {
  Field = "Field",
  Amu = "Amu",
}

export interface TSVGraphConfiguration {
  analytic: string;
  spatialUnitType: string;
  graphType: string;
}

export interface TSVUserActionEvent {
  graphConfigurations: TSVGraphConfiguration[];
  timeframe: Timeframe;
}

export interface GddCustomDegrees {
  baseTemperature: number;
  maxTemperature: number;
}
