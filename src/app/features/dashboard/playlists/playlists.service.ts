import { inject, Injectable } from "@angular/core";
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc, DocumentReference, query, where } from '@angular/fire/firestore';
import { KeySessionDataEnum } from "@core/interfaces/auth.interface";
import { AuthService } from "@core/services/auth.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class PlaylistsService {

  private readonly firestore = inject(Firestore);
  private readonly authService = inject(AuthService);

  /**
   * Get all playlists for the user (you can filter by user if needed)
   * @returns Observable of playlists
   */
  public getPlaylists(): Observable<any[]> {
    const user = this.authService.getSessionData(KeySessionDataEnum.UserData);
    const playlistsRef = collection(this.firestore, 'playlists');
    const q = query(playlistsRef, where('uid', '==', user.uid));
    return collectionData(q, { idField: 'id' });
  }

  /**
   * Get a specific playlist by ID
   * @param id - The ID of the playlist
   * @returns Observable of the playlist
   */
  public createPlaylist(data: any): Promise<DocumentReference<any>> {
    const user = this.authService.getSessionData(KeySessionDataEnum.UserData);
    const playlistsRef = collection(this.firestore, 'playlists');
    return addDoc(playlistsRef, { ...data, uid: user.uid });
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