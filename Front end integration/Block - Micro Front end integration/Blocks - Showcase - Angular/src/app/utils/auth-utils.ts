import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "src/environments/environment";

export interface Token {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  error?: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private _snackBar: MatSnackBar) {}

  /**
   * For test usage only
   * @returns
   */
  getToken(): Promise<Token> {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "password");
    urlencoded.append("client_id", "blocks_showcases_web");
    urlencoded.append("username", environment.userName);
    urlencoded.append("password", environment.userPassword);
    urlencoded.append("scope", "openid offline_access");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    return fetch(
      "https://identity.preprod.geosys-na.com/v2.1/connect/token",
      requestOptions
    )
      .then((r) => r.text())
      .then((result: string) => {
        var token = JSON.parse(result) as Token;
        if (token.error) {
          console.error("Error while autenticating:" + result);
          this._snackBar.open("Authentication Error");
        }
        return token;
      });
  }
}
