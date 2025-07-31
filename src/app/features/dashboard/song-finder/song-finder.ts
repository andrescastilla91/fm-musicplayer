import { AfterViewInit, Component, inject, signal, Directive, ElementRef, EventEmitter, HostListener, Output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { BaseComponent } from "@shared/directives/base-component.directive";
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from "rxjs";
import { SongFinderService } from "./song-finder.service";
import { SpotifyTrack, SpotifyTrackSearchResponse } from "./song-finder.interface";
import { PlaylistsService } from "../playlists/playlists.service";
import { NgClass, NgTemplateOutlet } from "@angular/common";
import { ClickOutsideDirective } from "@shared/directives/click-outside.directive";

@Component({
  selector: 'app-song-finder',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule, NgClass, ClickOutsideDirective, NgTemplateOutlet],
  templateUrl: './song-finder.html',
})
export class SongFinderComponent extends BaseComponent implements AfterViewInit {
  
  private readonly playlistsService = inject(PlaylistsService);
  private readonly songService = inject(SongFinderService);
  
  protected readonly filteredSongs = signal<SpotifyTrack[]>([]);
  protected readonly userPlaylists = signal<any[]>([]);
  protected readonly formControlFilter = new FormControl('');

  protected readonly nextUrl = signal<string | null>(null);
  protected readonly prevUrl = signal<string | null>(null);

  protected readonly dropdownOpen = signal<string | null>(null);

  ngAfterViewInit(): void {
    this.handleSearchInput();
    this.getUserPlaylists();
  }

  /**
   * Navigate to the playlists page
   * @returns {void}
   */
  protected goToPlaylists(): void {
    this.goToLink('/playlists')
  }

  /**
   * Logout the user
   * @returns {void}
   */
  protected logout(): void {
    this.authService.logout().subscribe(() => {
      this.notificationService.showNotify({
        type: 'success',
        message: 'Session closed successfully.',
      });
      this.router.navigate(['/']);
    });
  }
  
  /**
   * Check if the current view is desktop
   * @returns {boolean}
   */
  protected isDesktop(): boolean {
    return window.innerWidth >= 768;
  }

  /**
   * Toggle dropdown visibility for mobile view
   * @param id - The ID of the dropdown to toggle
   * @returns {void}
   */
  protected toggleDropdown(id: string): void {
    if (this.isDesktop()) return;
    this.dropdownOpen.set(this.dropdownOpen() === id ? null : id);
  }

  /**
   * Open dropdown for mobile view
   * @param id - The ID of the dropdown to open
   * @returns {void}
   */
  protected openDropdown(id: string): void {
    this.dropdownOpen.set(id);
  }

  /**
   * Close dropdown if it is currently open
   * @param id - The ID of the dropdown to close
   * @return {void}
   */
  protected closeDropdown(id: string): void {
    if (this.dropdownOpen() === id) this.dropdownOpen.set(null);
  }

  /**
   * Handle search input changes
   * Filters songs based on the input value.
   * If the input is empty, clears the filtered songs and resets pagination.
   * Debounces the input to avoid excessive API calls.
   * @returns {void}
   */
  protected handleSearchInput(): void {
    this.formControlFilter.valueChanges.pipe(
      filter((value: string | null) => (value ?? '').length > 3 || value === ''),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string | null) => {
        const safeTerm = (term ?? '');
        if( safeTerm === '') {
          this.setFilteredSongs();
          return [];
        }
        this.isLoading.set(true);
        return this.songService.searchSongs(safeTerm);
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.setFilteredSongs(data);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.showNotify({
          type: 'error',
          message: 'Error to search songs. Please try again later.',
        });
      }
    });
  }

  /**
   * Set the filtered songs and pagination URLs
   * @param songs - The response from the song search API
   * @returns {void}
   */
  private setFilteredSongs(songs?: SpotifyTrackSearchResponse): void {
    this.filteredSongs.set(songs?.tracks.items ?? []);
    this.nextUrl.set(songs?.tracks.next ?? null);
    this.prevUrl.set(songs?.tracks.previous ?? null);
    this.isLoading.set(false);
  }

  /**
   * Navigate to the next page of results
   * @param url - The URL of the next page
   * @returns {void}
   */
  protected goToNextPage(url: string | null): void {
    if (!url) return;
    this.isLoading.set(true);
    this.songService.searchSongsByUrl(url).subscribe({
      next: (data) => {
        this.filteredSongs.set(data.tracks.items);
        this.nextUrl.set(data.tracks.next);
        this.prevUrl.set(data.tracks.previous);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.notificationService.showNotify({
          type: 'error',
          message: 'Error to change page. Please try again later.',
        });
      }
    });
  }

  /**
   * Get the user's playlists
   * @returns {void}
   */
  protected getUserPlaylists(): void {
    this.playlistsService.getPlaylists()
      .pipe(takeUntil(this.destroy$))
      .subscribe((playlists: any[]) => this.userPlaylists.set(playlists));
  }

  /**
   * Add a song to a selected playlist
   * @param song - The song to add
   * @param item - The event item containing the selected playlist
   * @returns {void}
   */
  protected addSongToPlaylist(song: any, item: any): void {
    const element = item.target as HTMLSelectElement;
    const playlistId = element.value;

    if (!playlistId) return;
    
    // search for the current playlist
    const playlist = this.userPlaylists().find(p => p.id === playlistId);
    if (!playlist) return;

    // Add the song to the playlist
    const updatedSongs = Array.isArray(playlist.songs) ? [...playlist.songs, song] : [song];
    this.playlistsService.updatePlaylist(playlistId, { ...playlist, songs: updatedSongs })
      .then(() => {
        this.notificationService.showNotify({
          type: 'success',
          message: `Song added to the playlist "${playlist.name}".`
        });
      })
      .catch(() => {
        this.notificationService.showNotify({
          type: 'error',
          message: 'Could not add the song to the playlist.'
        });
      });
  }

}