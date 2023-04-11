import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { MFE } from "src/app/core/MFE";
import { loadRemoteModule } from "@angular-architects/module-federation";
import { AuthService } from "src/app/utils/auth-utils";

@Component({
  selector: "app-bm-container",
  templateUrl: "./bm-container.component.html",
  styleUrls: ["./bm-container.component.scss"],
})
export class BmContainerComponent implements AfterViewInit {
  @ViewChild("boundarymanagement", { static: false }) containerRef:
    | ElementRef
    | undefined;

  boundaryManagementModule: MFE | null = null;

  constructor(private authService: AuthService) {}

  async ngAfterViewInit(): Promise<void> {
    var token = await this.authService.getToken();

    this.boundaryManagementModule = await loadRemoteModule({
      remoteName: "mFEBoundaryManagement",
      exposedModule: "./FederatedModule",
      remoteEntry:
        "https://blocks-pp.geosys.com/boundary-management/v1/remoteEntry.js",
      type: "script",
    });

    const options = {
      locale: "en-US",
      g6Token: token.access_token,
      theme: this.getTheme(),
      snackbarConfig: {
        vertical: "top",
        horizontal: "right",
        backgroundColor: "#fefefe",
        textColor: "#000000",
      },
    };

    //options of the MFEs are sent at mounting
    await this.boundaryManagementModule?.mount(
      this.containerRef?.nativeElement,
      options
    );
  }

  // private sendboundaryManagementMFETokenRefreshEvent(): void {
  //   const event = new CustomEvent(G6MFEEvents.BM_RefreshToken, {
  //     detail: {
  //       token: this.authService.Token,
  //     },
  //   });
  //   document.dispatchEvent(event);
  // }

  /** The boundary management MFEs use theme to set colors and Font */
  private getTheme() {
    return {
      palette: {
        primary: {
          main: "#008aec",
          contrastText: "#fff",
          light: "#26bef6",
          dark: "#008aec",
        },
        secondary: {
          main: "#44C68B",
          contrastText: "#fff",
          light: "#60cf9c",
          dark: "#44C68B",
        },
        info: {
          main: "#4c4c4c",
          contrastText: "#fff",
        },
      },
      typography: {
        fontSize: 12,
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
      },
      shadows: "none",
    };
  }
}

