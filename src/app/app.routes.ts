import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { FeaturesComponent } from './components/features/features.component';
import { AboutComponent } from './components/about/about.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardHomeComponent } from './components/dashboard/home/dashboard-home.component';
import { AnnouncementsComponent } from './components/dashboard/announcements/announcements.component';
import { AnnouncementFormComponent } from './components/dashboard/announcements/announcement-form/announcement-form.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'features', component: FeaturesComponent },
      { path: 'about', component: AboutComponent },
    ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'leaves', component: DashboardHomeComponent },
      { path: 'documents', component: DashboardHomeComponent },
      { path: 'announcements', component: AnnouncementsComponent },
      { path: 'announcements/new', component: AnnouncementFormComponent },
      { path: 'announcements/edit/:id', component: AnnouncementFormComponent },
      { path: 'employees', component: DashboardHomeComponent },
      { path: 'profile', component: DashboardHomeComponent },
    ]
  }
];
