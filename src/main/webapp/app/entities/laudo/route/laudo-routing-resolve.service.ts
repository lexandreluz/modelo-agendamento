import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILaudo, Laudo } from '../laudo.model';
import { LaudoService } from '../service/laudo.service';

@Injectable({ providedIn: 'root' })
export class LaudoRoutingResolveService implements Resolve<ILaudo> {
  constructor(protected service: LaudoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILaudo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((laudo: HttpResponse<Laudo>) => {
          if (laudo.body) {
            return of(laudo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Laudo());
  }
}
