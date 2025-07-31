import { Component, inject, output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { BaseComponent } from "@shared/directives/base-component.directive";
import { PlaylistsService } from "src/app/features/dashboard/playlists/playlists.service";

@Component({
  selector: 'app-new-playlist-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 md:px-0">
      <div class="bg-white rounded-xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4">
        <h2 class="text-xl font-bold mb-2 text-fuchsia-700">Crear nueva playlist</h2>
        <form [formGroup]="formPlayList" (ngSubmit)="submitNewPlaylist()" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label for="playlist-name" class="font-semibold text-fuchsia-700 mb-1">Nombre de la lista <span class="text-red-500">*</span></label>
            <input id="playlist-name" type="text" formControlName="name" placeholder="Ej: Mis favoritas" 
              class="transition-all border-2 border-fuchsia-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200/50 rounded-lg px-4 py-3 text-lg bg-fuchsia-50 placeholder-fuchsia-300 outline-none shadow-sm" />
            @if(formPlayList.controls['name'].invalid && (formPlayList.controls['name'].dirty || formPlayList.controls['name'].touched)) {
              <div class="text-red-500 text-sm mt-1">
                El nombre es requerido.
              </div>
            }
          </div>
          <div class="flex flex-col gap-1">
            <label for="playlist-desc" class="font-semibold text-fuchsia-700 mb-1">Descripción</label>
            <textarea id="playlist-desc" formControlName="description" placeholder="¿Qué canciones vas a guardar aquí?" 
              class="transition-all border-2 border-fuchsia-200 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-200/50 rounded-lg px-4 py-3 text-base bg-fuchsia-50 placeholder-fuchsia-300 outline-none shadow-sm min-h-[80px] resize-none"></textarea>
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" (click)="closeModal()" class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Cancelar</button>
            <button type="submit" class="px-4 py-2 rounded bg-fuchsia-600 text-white font-semibold hover:bg-fuchsia-700">Crear</button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class NewPlaylistModalComponent extends BaseComponent {

  public close = output<void>();
  private readonly playlistsService = inject(PlaylistsService);

  protected formPlayList = new FormBuilder().group({
    name: ['', Validators.required],
    description: [''],
  });

  /**
   * Closes the modal by emitting a close event.
   * This method is used to close the modal when the user clicks the cancel button or after successfully creating a new playlist.
   * It emits the `close` output event to notify the parent component that the modal should be closed.
   * @returns {void}
   */
  protected closeModal(): void {
    this.close.emit();
  }
  
  /**
   * Submits the new playlist form and creates a new playlist.
   * This method validates the form, and if valid, it calls the PlaylistsService to create a new playlist with the provided name and description.
   * After successful creation, it closes the modal, resets the form, and shows a success notification.
   * @returns {void}
   */
  protected submitNewPlaylist(): void {
    this.formPlayList.markAllAsTouched();
    if (!this.formPlayList.valid) return;
    this.playlistsService.createPlaylist({
      name: this.formPlayList.controls['name'].value,
      description: this.formPlayList.controls['description'].value,
      songs: []
    }).then(() => {
      this.closeModal();
      this.formPlayList.reset();
      this.notificationService?.showNotify?.({
        type: 'success',
        message: 'Playlist created successfully.'
      });
    });
  }
}