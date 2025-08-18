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
import { LeavesComponent } from './components/dashboard/leaves/leaves.component';
import { LeaveFormComponent } from './components/dashboard/leaves/leave-form/leave-form.component';
import { LeaveDetailsComponent } from './components/dashboard/leaves/leave-details/leave-details.component';
import { DocumentsComponent } from './components/dashboard/documents/documents.component';
import { DocumentFormComponent } from './components/dashboard/documents/document-form/document-form.component';
import { DocumentDetailsComponent } from './components/dashboard/documents/document-details/document-details.component';
import { AuthGuard, RoleGuard, GuestGuard } from './guards';
import { UserRole } from './models/user.model';

export const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
      { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
      { path: 'features', component: FeaturesComponent },
      { path: 'about', component: AboutComponent },
    ]
  },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'leaves', component: LeavesComponent },
      { path: 'leaves/new', component: LeaveFormComponent },
      { path: 'leaves/edit/:id', component: LeaveFormComponent },
      { path: 'leaves/:id', component: LeaveDetailsComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'documents/new', component: DocumentFormComponent, canActivate: [RoleGuard], data: { roles: [UserRole.MANAGER] } },
      { path: 'documents/edit/:id', component: DocumentFormComponent, canActivate: [RoleGuard], data: { roles: [UserRole.MANAGER] } },
      { path: 'documents/:id', component: DocumentDetailsComponent },
      { path: 'announcements', component: AnnouncementsComponent },
      { path: 'announcements/new', component: AnnouncementFormComponent, canActivate: [RoleGuard], data: { roles: [UserRole.MANAGER] } },
      { path: 'announcements/edit/:id', component: AnnouncementFormComponent, canActivate: [RoleGuard], data: { roles: [UserRole.MANAGER] } },
      { path: 'employees', component: DashboardHomeComponent },
      { path: 'profile', component: DashboardHomeComponent },
    ]
  },
  {
    path: '**', redirectTo: ''
  }
];
