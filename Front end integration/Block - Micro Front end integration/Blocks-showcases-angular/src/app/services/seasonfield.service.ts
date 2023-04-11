import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

const seasonFieldPropertiesToLoad = "id,centroid,field.name";

export interface SeasonFieldResponse {
  id: string;
  field: { name: string };
  centroid: string;
}

export interface SeasonField {
  id: string;
  name: string;
  centroid: string;
}

@Injectable({
  providedIn: "root",
})
export class SeasonFieldService {
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private http: HttpClient) {}

  /**
   * Get all season fields for a grower. If no sowing date provided => "in season" field
   * @param growerId
   * @param sowingStartDate
   * @param sowingEndDate
   */
  getFirstSeasonField(token: string): Observable<SeasonField> {
    let url =
      "https://api-pp.geosys-na.net/DomainManagement/Geosys.DomainManagement.WebAPI/V6" +
      `/seasonfields?$fields=${seasonFieldPropertiesToLoad}&$limit=1` +
      `&$epsg-out=3857`;

    return this.http
      .get<SeasonFieldResponse[]>(url, this.createHeader(token))
      .pipe(
        map((sfReponse) => {
          return this.toSFEntity(sfReponse)[0];
        })
      );
  }

  private createHeader(token: string): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
    };
  }

  private toSFEntity(sfReponse: SeasonFieldResponse[]) {
    return sfReponse.map((sf): SeasonField => {
      return {
        name: sf.field.name,
        id: sf.id,
        centroid: sf.centroid,
      };
    });
  }
}
