import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: any) => {

      //  Ignore auth endpoints
      if (req.url.includes('/auth/login')) {
        return throwError(() => err);
      }

      if (err.status === 401) {
        console.warn('401 received from:', req.url);

        
        // Only redirect if token truly expired / invalid
       

        router.navigate(['/login']);
      }

      return throwError(() => err);
    })
  );
};