export interface SpotifyTrackSearchResponse {
  tracks: {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: SpotifyTrack[];
  };
}

export interface SpotifyTrack {
  album: {
    name: string;
    images: { url: string; height: number; width: number }[];
    artists: SpotifyArtist[];
  };
  artists: SpotifyArtist[];
  external_urls: { spotify: string };
  id: string;
  name: string;
  preview_url: string | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  external_urls: { spotify: string };
}