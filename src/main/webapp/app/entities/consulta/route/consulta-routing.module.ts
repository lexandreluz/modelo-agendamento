import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConsultaComponent } from '../list/consulta.component';
import { ConsultaDetailComponent } from '../detail/consulta-detail.component';
import { ConsultaUpdateComponent } from '../update/consulta-update.component';
import { ConsultaRoutingResolveService } from './consulta-routing-resolve.service';

const consultaRoute: Routes = [
  {
    path: '',
    component: ConsultaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConsultaDetailComponent,
    resolve: {
      consulta: ConsultaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConsultaUpdateComponent,
    resolve: {
      consulta: ConsultaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConsultaUpdateComponent,
    resolve: {
      consulta: ConsultaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(consultaRoute)],
  exports: [RouterModule],
})
export class ConsultaRoutingModule {}
