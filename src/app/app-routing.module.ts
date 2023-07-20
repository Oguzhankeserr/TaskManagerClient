import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent, Sidenav2Component, TabsComponent } from './components';
import { ForgotPasswordComponent } from './components/login-page/forgot-password/forgot-password.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SummaryComponent } from './components/summary/summary.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { CreateIssueDialogComponent } from './components/create-issue-dialog/create-issue-dialog.component';
import { BoardComponent } from './components/board/board.component';
import { TaskComponent } from './components/task/task.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AuthGuard } from './guards/guards.guard';
import { PasswordChangePageComponent } from './components/password-change-page/password-change-page.component';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: '',
    component: HomepageComponent,
    children: [
      {
        path: 'summary',
        component: SummaryComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'calendar',
        component: CalendarComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'project-settings',
        component: ProjectDetailsComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'create-issue-dialog',
        component: CreateIssueDialogComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'board',
        component: BoardComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'task',
        component: TaskComponent,
        // canActivate: [AuthGuard],
      }
    ],
  },
  {
    path: 'create-project',
    component: CreateProjectComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'home',
    component: HomepageComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'password-change',
    component: PasswordChangePageComponent
  }
];

@NgModule({
  // providers:[AuthGuard],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
