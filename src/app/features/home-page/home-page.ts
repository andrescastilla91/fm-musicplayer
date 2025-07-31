import { Component } from "@angular/core";
import { KeySessionDataEnum, UserData } from "@core/interfaces/auth.interface";
import { BaseComponent } from "@shared/directives/base-component.directive";

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <main class="flex flex-col items-center justify-center min-h-screen w-full relative overflow-hidden" role="main">
      <header class="w-full max-w-md mx-auto flex flex-col items-center mt-8 sm:mt-0" aria-label="Encabezado principal">
        <div class="flex items-center gap-3 mb-4">
          <svg class="w-12 h-12 text-pink-400 drop-shadow-lg" fill="none" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="currentColor" fill-opacity="0.2" />
            <path d="M16 36V14l20-4v22" stroke="#f472b6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="20" cy="36" r="2.5" fill="#f472b6" />
            <circle cx="36" cy="32" r="2.5" fill="#f472b6" />
          </svg>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow m-0">FM MusicPlayer</h1>
        </div>
        <p class="text-base sm:text-lg text-white/80 font-medium text-center">Descubre, escucha y crea tu propio universo musical.</p>
      </header>
      <section class="z-10 w-full max-w-md mx-auto p-4 sm:p-8 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center mt-4" aria-label="Inicio de sesión">
        <form class="w-full flex flex-col items-center gap-3" autocomplete="off">
          <button (click)="loginWithGoogle()" type="button" class="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 text-white font-semibold text-base sm:text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200">
            <svg class="w-6 h-6" viewBox="0 0 48 48"><g><path fill="#fff" d="M44.5 20H24v8.5h11.7C34.7 33.6 30.1 36.5 24 36.5c-7 0-12.5-5.5-12.5-12.5S17 11.5 24 11.5c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.7 4.7 29.6 2.5 24 2.5 12.7 2.5 3.5 11.7 3.5 23S12.7 43.5 24 43.5c10.5 0 20-7.5 20-20 0-1.3-.1-2.2-.3-3.5z"/><path fill="#4285F4" d="M6.3 14.7l6.6 4.8C14.3 16.1 18.7 13.5 24 13.5c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.7 4.7 29.6 2.5 24 2.5c-7.7 0-14.2 4.3-17.7 10.7z"/><path fill="#34A853" d="M24 43.5c6.1 0 10.7-2 14.2-5.5l-6.6-5.4c-2 1.4-4.6 2.4-7.6 2.4-6.1 0-11.2-4.1-13-9.6l-6.5 5c3.5 6.4 10.1 10.1 19.5 10.1z"/><path fill="#FBBC05" d="M43.5 24.5c0-1.3-.1-2.2-.3-3.5H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-2.1 0-4.1-.7-5.6-2l-6.5 5c2.8 5.5 8.1 9 14.1 9 8.2 0 15-6.7 15-15z"/><path fill="#EA4335" d="M24 13.5c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.7 4.7 29.6 2.5 24 2.5c-7.7 0-14.2 4.3-17.7 10.7l6.6 4.8C14.3 16.1 18.7 13.5 24 13.5z"/></g></svg>
            Iniciar sesión con Google
          </button>
        </form>
        <div class="mt-6 text-center">
          <span class="text-xs text-white/50">Al continuar aceptas nuestros <a href="#" class="underline hover:text-pink-200">Términos</a> y <a href="#" class="underline hover:text-pink-200">Política de privacidad</a>.</span>
        </div>
      </section>
    </main>
  `,
})
export class HomePageComponent extends BaseComponent {

  /**
   * Initiates login with Google and handles user session data.
   * Displays notifications for success or error during the login process.
   * This method uses the AuthService to log in the user with Google, retrieves the user's ID token, and stores user data in session storage.
   * If the login is successful, it navigates to the home page and shows a success notification.
   * If there is an error, it shows an error notification.
   * @returns {void}
   */
  protected loginWithGoogle(): void {
    this.authService.loginWithGoogle().subscribe({
      next: (user) => {
        user.getIdToken().then((idToken: string) => {
          const userData: UserData = {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName!,
            photoURL: user.photoURL!,
            idToken: idToken,
          };
          this.authService.setSessionData(KeySessionDataEnum.UserData, JSON.stringify(userData));
          this.goToLink('/').finally()
        }).catch(() => {
          this.notificationService.showNotify({
            type: 'error',
            message: 'Error to get user token. Please try again.',
          });
        });
      },
      error: () => {
        this.notificationService.showNotify({
          type: 'error',
          message: 'Error to login with Google. Please try again.',
        });
      }
    });
  }

}
