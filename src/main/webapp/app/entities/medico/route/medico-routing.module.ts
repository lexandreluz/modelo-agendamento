import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MedicoComponent } from '../list/medico.component';
import { MedicoDetailComponent } from '../detail/medico-detail.component';
import { MedicoUpdateComponent } from '../update/medico-update.component';
import { MedicoRoutingResolveService } from './medico-routing-resolve.service';

const medicoRoute: Routes = [
  {
    path: '',
    component: MedicoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MedicoDetailComponent,
    resolve: {
      medico: MedicoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MedicoUpdateComponent,
    resolve: {
      medico: MedicoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MedicoUpdateComponent,
    resolve: {
      medico: MedicoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(medicoRoute)],
  exports: [RouterModule],
})
export class MedicoRoutingModule {}
