import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { MFE, MFEEvents } from "src/app/core/MFE";
import { loadRemoteModule } from "@angular-architects/module-federation";
import {
  SpatialUnit,
  SpatialUnitType,
  TSVConfigureEvent,
  TSVUserActionEvent,
} from "src/app/core/TSVConfigure.event";

import {
  SeasonField,
  SeasonFieldService,
} from "src/app/services/seasonfield.service";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/utils/auth-utils";

@Component({
  selector: "app-tsv-container",
  templateUrl: "./tsv-container.component.html",
  styleUrls: ["./tsv-container.component.scss"],
})
export class TsvContainerComponent implements AfterViewInit, OnDestroy {
  remoteEntryUrl = "https://blocks-pp.geosys.com/time-series-viewer/v1/";

  @ViewChild("timeseries", { static: false }) containerRef:
    | ElementRef
    | undefined;

  timeSeriesViewerModule: MFE | null = null;
  seasonField: SeasonField | null = null;
  pending = true;
  events = "";

  constructor(
    private seasonFieldService: SeasonFieldService,
    private authService: AuthService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.pending = true;

    await this.loadOneField();

    if (this.seasonField) {
      //Load remote module dynamicaly
      this.timeSeriesViewerModule = await loadRemoteModule({
        type: "module",
        exposedModule: "./FederatedModule",
        remoteEntry: this.remoteEntryUrl + "remoteEntry.mjs",
      });

      //Mount the MFE in the DOM
      await this.timeSeriesViewerModule?.mount([
        this.containerRef?.nativeElement as HTMLElement,
      ]);

      //Send event to configure one field to display
      this.sendOneField();
    }
    this.pending = false;
  }

  ngOnDestroy(): void {
    this.timeSeriesViewerModule?.unmount();
  }

  /**
   *  Listen for one event sent by the TSV
   */
  @HostListener(`document:${MFEEvents.TSV_UserAction}`, ["$event"])
  userActionOnTSV(event: CustomEvent<TSVUserActionEvent>): void {
    this.events += JSON.stringify(event.detail);
  }

  /**
   * Send Event requesting an export of data
   */
  async export(): Promise<void> {
    const event = new CustomEvent(MFEEvents.TSV_Export);
    document.dispatchEvent(event);
  }

  /**
   * Loads the firs season field for the current account
   */
  private async loadOneField(): Promise<void> {
    var token = await this.authService.getToken();
    var sf = await firstValueFrom(
      this.seasonFieldService.getFirstSeasonField(token.access_token)
    );
    if (sf) {
      this.seasonField = sf;
    }
  }

  private async sendOneField(): Promise<void> {
    var token = await this.authService.getToken();
    if (this.seasonField)
      this.sendTimeSeriesViewerMFEEvent(token.access_token, this.seasonField);
  }

  private sendTimeSeriesViewerMFEEvent(
    token: string,
    seasonField: SeasonField
  ) {
    const dateNow = new Date();
    let startDate = new Date(dateNow.getFullYear(), 0, 1, 0, 0, 0);
    let endDate = new Date(dateNow.getFullYear(), 11, 31, 0, 0, 0);

    let spatialUnits: SpatialUnit[] = [
      {
        name: seasonField.name,
        centroid: seasonField.centroid,
        type: SpatialUnitType.Field,
        value: seasonField.id,
      },
    ];

    const event = new CustomEvent<TSVConfigureEvent>(MFEEvents.TSV_Configure, {
      detail: {
        spatialUnits: spatialUnits,
        culture: "en-US",
        token: token,
        remoteUrl: this.remoteEntryUrl,
        yearsOfHistory: 10,
        timeframe: {
          start: startDate,
          end: endDate,
        },
        gddCustom: {
          baseTemperature: 0,
          maxTemperature: 30,
        },
        graphDataTimeRange: 30,
      },
    });
    document.dispatchEvent(event);
  }
}

