import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AlertDialogData, NotificationData } from "./notifications.interface";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {

  private readonly dialogSubject = new BehaviorSubject<AlertDialogData | null>(null);
  private resolver: ((confirmed: boolean) => void) | null = null;
  public dialog$ = this.dialogSubject.asObservable();

  private readonly notifySubject = new BehaviorSubject<NotificationData | null>(null);
  public notify$ = this.notifySubject.asObservable();

  /**
   * Opens a confirmation dialog with the provided data.
   * This method will return a Promise that resolves to true if the user confirms, or false if they cancel.
   * @param data - The data for the dialog, including title, message, confirmText, and cancelText.
   * @returns Promise<boolean>
   */
  public confirm(data: AlertDialogData): Promise<boolean> {
    this.dialogSubject.next(data);
    return new Promise(resolve => (this.resolver = resolve));
  }

  /**
   * Resolves the confirmation dialog with the provided result.
   * This method is called when the user confirms or cancels the dialog.
   * It will emit the result to the resolver function and reset the dialog state.
   * @param result - The result of the dialog, true for confirm, false for cancel.
   */
  public resolve(result: boolean) {
    this.resolver?.(result);
    this.dialogSubject.next(null);
    this.resolver = null;
  }

  /**
   * Shows a notification with the provided data.
   * This method will emit the notification data to the notifySubject, which can be subscribed to for displaying notifications.
   * The notification will automatically disappear after 3 seconds.
   * @param data - The data for the notification, including type and message.
   */
  public showNotify(data: NotificationData) {
    this.notifySubject.next(data);
    setTimeout(() => this.notifySubject.next(null), 3000);
  }

}