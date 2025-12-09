import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../components/user/login/login.component';

import { LandingComponent } from '../components/system/landing-page/landing-page.component';
import { RegistrationComponent } from '../components/user/registration/registration.component';
import { ProfileComponent } from '../components/user/profile/profile.component';
import { AdminDashboardComponent } from '../components/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [

    { path: 'landing', component: LandingComponent },
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'profile', component: ProfileComponent },
    {
        path: 'admin',
        component: AdminDashboardComponent,
        children: [
          
        ]
      }
];