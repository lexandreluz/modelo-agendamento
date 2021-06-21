import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConsulta, Consulta } from '../consulta.model';
import { ConsultaService } from '../service/consulta.service';

@Injectable({ providedIn: 'root' })
export class ConsultaRoutingResolveService implements Resolve<IConsulta> {
  constructor(protected service: ConsultaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConsulta> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((consulta: HttpResponse<Consulta>) => {
          if (consulta.body) {
            return of(consulta.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Consulta());
  }
}
