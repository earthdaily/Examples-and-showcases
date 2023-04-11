export interface MFE {
  mount(elements: Element[]): Promise<unknown>;
  mount(element: Element, options?: any): Promise<unknown>;
  unmount(element?: Element): void;
}

export class MFEEvents {
  public static readonly TSV_Configure = "MFE.TimeSeriesViewer.Configure";
  public static readonly TSV_RefreshToken = "MFE.TimeSeriesViewer.RefreshToken";
  public static readonly TSV_Export = "MFE.TimeSeriesViewer.Export";
  public static readonly TSV_UserAction = "MFE.TimeSeriesViewer.UserAction";
}
