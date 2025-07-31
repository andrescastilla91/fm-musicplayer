import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertDialogComponent } from '@shared/components/notifications/alert-dialog';
import { AlertDialogData, NotificationData } from '@shared/components/notifications/notifications.interface';
import { NotificationsService } from '@shared/components/notifications/notifications.service';
import { ToastComponent } from '@shared/components/notifications/toast';
import { BaseComponent } from '@shared/directives/base-component.directive';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, AlertDialogComponent],
  template: `
    <main class="min-h-screen w-full flex flex-col bg-gradient-to-br from-indigo-900 via-fuchsia-700 to-pink-600 relative overflow-hidden">
      @if (notification()) {
        <app-toast [data]="notification()" />
      }
      <section class="flex-1 flex flex-col px-4 md:px-0" role="main">
        <router-outlet />
      </section>
      @if (dialog()){
        <app-alert-dialog
          [title]="dialog()?.title"
          [message]="dialog()?.message || '¿Estás seguro?'"
          [confirmText]="dialog()?.confirmText || 'Aceptar'"
          [cancelText]="dialog()?.cancelText || null"
          (confirm)="resolveConfirm(true)"
          (cancel)="resolveConfirm(false)"
        />
      }
    </main>
  `,
})
export class AppComponent extends BaseComponent {

  protected readonly dialog = signal<AlertDialogData | null>(null);
  protected readonly notification = signal<NotificationData | null>(null);

  constructor() {
    super();
    this.notificationService.dialog$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.dialog.set(data));
    
    this.notificationService.notify$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.notification.set(data));
  }


  protected resolveConfirm(result: boolean) {
    this.notificationService.resolve(result);
  }
}
