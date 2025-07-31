import { Directive, inject, OnDestroy, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@core/services/auth.service";
import { NotificationsService } from "@shared/components/notifications/notifications.service";
import { Subject } from "rxjs";

@Directive()
export abstract class BaseComponent implements OnDestroy {
  
  protected readonly destroy$ = new Subject<void>();
  protected readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  protected readonly notificationService = inject(NotificationsService);

  protected readonly isLoading = signal<boolean>(false);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Navigate to a specific link
   * @param path - The path to navigate to
   * @param params - Optional parameters for the route
   * @param options - Additional navigation options
   * @returns {Promise<boolean>} - Returns a promise that resolves to true if navigation was successful, false otherwise
   */
  protected async goToLink(
    path: string,
    params?: any,
    options: {
      queryParams?: {[key: string]: any},
      relativeTo?: string,
    } = {}
  ): Promise<boolean> {
    try {
      // Validate that the path is not empty
      if (!path) {
        console.warn('Attempted to navigate to an empty route');
        return false;
      }

      // Determine if it's an absolute route or needs a prefix
      const prefix = '/dashboard';
      const fullPath = `${prefix}${path}`;

      // Build the array of commands to navigate
      const commands = params ? [fullPath, params] : [fullPath];

      // Extract navigation options
      const { queryParams, relativeTo, ...extraOptions } = options;
      const navigationOptions = {
        queryParams,
        ...extraOptions
      };

      // Execute the navigation
      return await this.router.navigate(commands, navigationOptions);
    } catch (error) {
      console.error('Error during navigation:', error);
      return false;
    }
  }

}