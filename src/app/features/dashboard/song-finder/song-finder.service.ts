import { inject, Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { Observable, switchMap } from 'rxjs';
import { SpotifyTrackSearchResponse } from './song-finder.interface';
import { environment } from '@environments/environment';
import { AuthService } from '@core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SongFinderService {

  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthService);

  /**
   * Search for songs using the Spotify API
   * @param query - The search query
   * @returns Observable of SpotifyTrackSearchResponse
   */
  public searchSongs(query: string): Observable<SpotifyTrackSearchResponse> {
    const params = { q: query, type: 'track', limit: 10 };
    const url = `${environment.apiSpotify}/search`;
    return this.authService.getValidSpotifyToken().pipe(
      switchMap(token =>
        this.apiService.get<SpotifyTrackSearchResponse>(url, params)
      )
    );
  }

  /**
   * Search for songs by URL
   * @param url - The URL to search for
   * @returns Observable of SpotifyTrackSearchResponse
   */
  public searchSongsByUrl(url: string): Observable<SpotifyTrackSearchResponse> {
    return this.authService.getValidSpotifyToken().pipe(
      switchMap(token => {
        return this.apiService.get<SpotifyTrackSearchResponse>(url);
      })
    );
  }

}