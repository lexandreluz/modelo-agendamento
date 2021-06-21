import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAgendamentoConsulta, AgendamentoConsulta } from '../agendamento-consulta.model';
import { AgendamentoConsultaService } from '../service/agendamento-consulta.service';

@Injectable({ providedIn: 'root' })
export class AgendamentoConsultaRoutingResolveService implements Resolve<IAgendamentoConsulta> {
  constructor(protected service: AgendamentoConsultaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAgendamentoConsulta> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((agendamentoConsulta: HttpResponse<AgendamentoConsulta>) => {
          if (agendamentoConsulta.body) {
            return of(agendamentoConsulta.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AgendamentoConsulta());
  }
}
