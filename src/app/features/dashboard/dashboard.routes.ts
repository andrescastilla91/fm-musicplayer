import { Routes } from "@angular/router";
import { SessionSpotifyResolve } from "@core/guards/sesion-spotify.resolve";

export const routes:Routes = [
  {
    path: '',
    title: 'Dashboard - FM MusicPlayer',
    resolve: {
      session: SessionSpotifyResolve
    },
    loadComponent: () => import('./dashboard').then(m => m.DashboardComponent),
    children: [
      { path: '', redirectTo: 'song-finder', pathMatch: 'full' },
      {
        path: 'song-finder',
        title: 'Song Finder - FM MusicPlayer',
        loadComponent: () => import('./song-finder/song-finder').then(m => m.SongFinderComponent),
      },
      {
        path: 'playlists',
        title: 'Playlists - FM MusicPlayer',
        loadComponent: () => import('./playlists/playlists').then(m => m.PlaylistsComponent),
      }
    ],
  },
];
