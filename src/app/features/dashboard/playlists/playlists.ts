import { Component, inject, signal, AfterViewInit } from "@angular/core";
import { LucideAngularModule } from "lucide-angular";
import { PlaylistsService } from './playlists.service';
import { BaseComponent } from "@shared/directives/base-component.directive";
import { takeUntil } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { NewPlaylistModalComponent } from "@shared/components/modal/new-playlist.modal";

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule, NewPlaylistModalComponent],
  templateUrl: './playlists.html',
})
export class PlaylistsComponent extends BaseComponent implements AfterViewInit {
  
  private readonly playlistsService = inject(PlaylistsService);
  
  protected readonly userPlaylists = signal<any[]>([]);
  protected readonly showModal = signal<boolean>(false);

  ngAfterViewInit(): void {
    this.getAllPlaylist(); 
  }

  /**
   * Navigates to the song finder page.
   * This method is called when the user clicks the "Buscar canciones" button.
   * @returns {void}
   */
  protected goToSongFinder(): void {
    this.goToLink('/song-finder');
  }

  /**
   * Fetches all playlists from the service and updates the userPlaylists signal.
   * This method is called after the component view has been initialized.
   * This ensures that the playlists are loaded when the component is ready.
   * @returns {void}
   */
  private getAllPlaylist(): void{
    this.isLoading.set(true);
    this.playlistsService.getPlaylists()
      .pipe(takeUntil(this.destroy$))
      .subscribe((playlists: any[]) => {
        this.userPlaylists.set(playlists);
        this.isLoading.set(false);
      });
  }

  /**
   * Removes a song from a specific playlist.
   * Updates the playlist in the service and reflects changes in the userPlaylists signal.
   * @param {any} playlist - The playlist from which to remove the song.
   * @param {any} song - The song to be removed.
   * @return {void}
   */
  protected removeSongFromPlaylist(playlist: any, song: any): void {
    const updatedSongs = playlist.songs.filter((s: any) => s.id !== song.id);
    this.playlistsService.updatePlaylist(playlist.id, { ...playlist, songs: updatedSongs })
      .then(() => {
        this.notificationService?.showNotify?.({
          type: 'success',
          message: 'Canción eliminada de la lista.'
        });
        this.userPlaylists.set(
          this.userPlaylists().map(p =>
            p.id === playlist.id ? { ...p, songs: updatedSongs } : p
          )
        );
      });
  }

  /**
   * Deletes a playlist completely.
   * This method prompts the user for confirmation before proceeding with deletion.
   * If confirmed, it calls the service to delete the playlist and updates the userPlaylists signal.
   * @param playlist The playlist object to delete
   * @returns {void}
   */
  protected deletePlaylist(playlist: any): void {
    this.notificationService.confirm({
      title: 'Confirmación',
      message: `¿Seguro que deseas eliminar la lista "${playlist.name}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).then(confirmed => {
      if (!confirmed) return;
      
      this.playlistsService.deletePlaylist(playlist.id)
        .then(() => {
          this.notificationService?.showNotify?.({
            type: 'success',
            message: 'Lista eliminada correctamente.'
          });
          this.userPlaylists.set(this.userPlaylists().filter((p: any) => p.id !== playlist.id));
        });
    });
  }
}