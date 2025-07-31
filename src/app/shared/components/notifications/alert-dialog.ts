import { Component, input, output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-2">
      
      <div class="bg-white/90 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in-up">
        <div class="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center justify-center">
          <span class="rounded-full bg-gradient-to-tr from-pink-500 via-fuchsia-500 to-indigo-500 p-3 shadow-xl">
            <svg *ngIf="(title() ?? '').toLowerCase().includes('error')" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ef4444"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>
            <svg *ngIf="(title() ?? '').toLowerCase().includes('exito') || (title() ?? '').toLowerCase().includes('success')" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#22c55e"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>
            <svg *ngIf="!(title() ?? '').toLowerCase().includes('error') && !(title() ?? '').toLowerCase().includes('exito') && !(title() ?? '').toLowerCase().includes('success')" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#818cf8"/><path d="M12 8v4m0 4h.01" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg>
          </span>
        </div>
        <h2 class="text-2xl font-extrabold text-gray-900 mb-2 text-center mt-6">{{ title() }}</h2>
        <p class="text-gray-700 mb-6 text-center text-base">{{ message() }}</p>
        <div class="flex justify-end gap-3 mt-4">
          @if (cancelText()) {
            <button class="px-5 py-2 rounded-xl bg-white/80 border border-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-100 transition-all" (click)="onClickCloseDialog()">
              {{ cancelText() }}
            </button>
          }
          <button class="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 text-white font-semibold shadow hover:scale-105 hover:shadow-xl transition-all" (click)="onClickConfirmDialog()">
            {{ confirmText() }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AlertDialogComponent {

  public title = input<string>();
  public message = input.required<string>();
  public confirmText = input<string>('Aceptar');
  public cancelText = input<string | null>(null);
  
  // Outputs to notify parent component about confirmation or cancellation
  public confirm = output<void>();
  public cancel = output<void>(); 

  /**
   * Closes the dialog by emitting the cancel output event.
   * This method is used to close the dialog when the user clicks the cancel button.
   * @returns {void}
   */
  protected onClickCloseDialog(): void {
    this.cancel.emit();
  }

  /**
   * Confirms the dialog by emitting the confirm output event.
   * This method is used to confirm the action when the user clicks the confirm button.
   * @returns {void}
   */
  protected onClickConfirmDialog(): void {
    this.confirm.emit();
  }
}