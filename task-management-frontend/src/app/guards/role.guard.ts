import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const role = localStorage.getItem('role');
  const allowedRoles = route.data['roles'];

  if (!allowedRoles.includes(role)) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
