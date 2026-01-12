import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { TaskForm } from './tasks/task-form/task-form';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent
  },
  {
    path: 'tasks/create',
    component: TaskFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Manager'] }
  }
];