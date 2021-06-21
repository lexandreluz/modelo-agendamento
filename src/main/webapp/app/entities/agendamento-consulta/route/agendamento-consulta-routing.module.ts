import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AgendamentoConsultaComponent } from '../list/agendamento-consulta.component';
import { AgendamentoConsultaDetailComponent } from '../detail/agendamento-consulta-detail.component';
import { AgendamentoConsultaUpdateComponent } from '../update/agendamento-consulta-update.component';
import { AgendamentoConsultaRoutingResolveService } from './agendamento-consulta-routing-resolve.service';

const agendamentoConsultaRoute: Routes = [
  {
    path: '',
    component: AgendamentoConsultaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AgendamentoConsultaDetailComponent,
    resolve: {
      agendamentoConsulta: AgendamentoConsultaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AgendamentoConsultaUpdateComponent,
    resolve: {
      agendamentoConsulta: AgendamentoConsultaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AgendamentoConsultaUpdateComponent,
    resolve: {
      agendamentoConsulta: AgendamentoConsultaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(agendamentoConsultaRoute)],
  exports: [RouterModule],
})
export class AgendamentoConsultaRoutingModule {}
