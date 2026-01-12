import { CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route) => {
  const allowed = route.data['roles'];
  const role = localStorage.getItem('role');
  return allowed.includes(role);
};
