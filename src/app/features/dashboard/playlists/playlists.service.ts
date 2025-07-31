import { inject, Injectable } from "@angular/core";
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class PlaylistsService {

  private readonly firestore = inject(Firestore);

  /**
   * Get all playlists for the user (you can filter by user if needed)
   * @returns Observable of playlists
   */
  public getPlaylists(): Observable<any[]> {
    const playlistsRef = collection(this.firestore, 'playlists');
    return collectionData(playlistsRef, { idField: 'id' });
  }

  /**
   * Get a specific playlist by ID
   * @param id - The ID of the playlist
   * @returns Observable of the playlist
   */
  public createPlaylist(data: any): Promise<DocumentReference<any>> {
    const playlistsRef = collection(this.firestore, 'playlists');
    return addDoc(playlistsRef, data);
  }

  /**
   * Delete a playlist by ID
   * @param id - The ID of the playlist to delete
   * @returns Promise<void>
   */
  public deletePlaylist(id: string): Promise<void> {
    const playlistDoc = doc(this.firestore, `playlists/${id}`);
    return deleteDoc(playlistDoc);
  }

  /**
   * Update a playlist by ID
   * @param id - The ID of the playlist to update
   * @param data - The data to update in the playlist
   * @returns Promise<void>
   */
  public updatePlaylist(id: string, data: any): Promise<void> {
    const playlistDoc = doc(this.firestore, `playlists/${id}`);
    return updateDoc(playlistDoc, data);
  }
}