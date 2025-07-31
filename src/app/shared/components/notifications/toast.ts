import { NgClass, CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { NotificationData } from "./notifications.interface";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass, CommonModule],
  template: `
  @if (data()) {
    <section
      class="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90vw] max-w-xs sm:max-w-sm px-4 py-3 rounded-2xl shadow-2xl text-white text-sm sm:text-base font-medium flex items-center gap-3 z-[100] animate-fade-in-up backdrop-blur-lg border border-white/20"
      [ngClass]="toastClasses[data()!.type]"
      style="min-width: 220px;"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span class="text-2xl" aria-hidden="true">
        <ng-container [ngSwitch]="data()!.type">
          <span *ngSwitchCase="'success'">✔️</span>
          <span *ngSwitchCase="'error'">❌</span>
          <span *ngSwitchCase="'info'">ℹ️</span>
        </ng-container>
      </span>
      <span class="flex-1">{{ data()?.message }}</span>
    </section>
  }
  `,
})
export class ToastComponent {
  
  public data = input<NotificationData | null>(null);

  protected toastClasses:Record<NotificationData['type'], string> = {
    success: 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-400/90',
    error: 'bg-gradient-to-r from-red-500 via-pink-500 to-fuchsia-500/90',
    info: 'bg-gradient-to-r from-blue-500 via-indigo-400 to-fuchsia-400/90',
  };
}