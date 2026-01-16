import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data['roles'];
  const role = auth.getRole();

  if (allowedRoles.includes(role)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
