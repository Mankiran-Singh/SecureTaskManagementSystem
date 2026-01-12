import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './dashboard/dashboard';
import { TaskForm } from './tasks/task-form/task-form';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { Register } from './auth/register/register';
import { TaskList } from './tasks/task-list/task-list';


export  const routes: Routes = [
 
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'tasks',
    component: TaskList,
    canActivate: [authGuard]
  },
  {
    path: 'tasks/create',
    component: TaskForm,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Manager'] }
  },

  // fallback route
  { path: '**', redirectTo: 'login' }
];

