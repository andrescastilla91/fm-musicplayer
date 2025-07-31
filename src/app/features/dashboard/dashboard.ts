import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="flex-1 pb-16 lg:pb-0 lg:px-4 lg:pt-4">
      <router-outlet />
    </main>
  `,
})
export class DashboardComponent {}