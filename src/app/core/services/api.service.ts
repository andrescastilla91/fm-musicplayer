import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private readonly http: HttpClient = inject(HttpClient);

  public get<T>(endpoint: string, params: Record<string, any> = {}): Observable<T> {
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get<T>(endpoint, { params: httpParams });
  }

  public post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(endpoint, body);
  }
  
}