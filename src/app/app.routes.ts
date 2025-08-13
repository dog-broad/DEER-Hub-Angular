import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { FeaturesComponent } from './components/features/features.component';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardHomeComponent } from './components/dashboard/home/dashboard-home.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'features', component: FeaturesComponent },
      { path: 'about', component: AboutComponent },
    ]
  },
  // Dashboard routes (separate layout)
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      // Placeholder routes for future components
      { path: 'leaves', component: DashboardHomeComponent },
      { path: 'documents', component: DashboardHomeComponent },
      { path: 'announcements', component: DashboardHomeComponent },
      { path: 'employees', component: DashboardHomeComponent },
      { path: 'profile', component: DashboardHomeComponent },
    ]
  }
];
