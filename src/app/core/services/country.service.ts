import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './api.service';
import { City, CityResponse } from '../../types/city';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CountryService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http, environment.countryApiUrl);
  }

  getAllCitiesWithCountry(country: string): Observable<CityResponse> {
    return super.post<CityResponse>('/countries/cities', {
      country: country,
    }).pipe(map((response) => response));
  }

  getCitiesForDropdown(country: string): Observable<City[]> {
    return this.getAllCitiesWithCountry(country).pipe(
      map((response) =>
        [...new Set(response.data)].map((city) => ({
          name: city,
          value: city,
        }))
      )
    );
  }
}
