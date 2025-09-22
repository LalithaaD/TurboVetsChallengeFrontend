import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserRole } from '../store/auth/auth.selectors';
import { map, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  
  const allowedRoles = route.data?.['allowedRoles'] as string[];
  
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }
  
  return store.select(selectUserRole).pipe(
    take(1),
    map(userRole => {
      if (userRole && allowedRoles.includes(userRole)) {
        return true;
      } else {
        router.navigate(['/dashboard']);
        return false;
      }
    })
  );
};
