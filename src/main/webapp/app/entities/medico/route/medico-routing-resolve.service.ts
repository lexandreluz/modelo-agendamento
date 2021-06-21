import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMedico, Medico } from '../medico.model';
import { MedicoService } from '../service/medico.service';

@Injectable({ providedIn: 'root' })
export class MedicoRoutingResolveService implements Resolve<IMedico> {
  constructor(protected service: MedicoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMedico> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((medico: HttpResponse<Medico>) => {
          if (medico.body) {
            return of(medico.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Medico());
  }
}
