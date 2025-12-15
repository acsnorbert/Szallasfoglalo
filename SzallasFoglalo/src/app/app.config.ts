import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import {
provideCharts,
withDefaultRegisterables,
} from 'ng2-charts';
import { bootstrapApplication } from '@angular/platform-browser';
import { AdminDashboardComponent } from '../components/admin/admin-dashboard/admin-dashboard';

bootstrapApplication(AdminDashboardComponent, { providers: [ provideCharts(withDefaultRegisterables()), ], }).catch((err) => console.error(err));

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    )
  ],
  
  
  
};
