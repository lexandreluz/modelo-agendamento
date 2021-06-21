import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LaudoComponent } from '../list/laudo.component';
import { LaudoDetailComponent } from '../detail/laudo-detail.component';
import { LaudoUpdateComponent } from '../update/laudo-update.component';
import { LaudoRoutingResolveService } from './laudo-routing-resolve.service';

const laudoRoute: Routes = [
  {
    path: '',
    component: LaudoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LaudoDetailComponent,
    resolve: {
      laudo: LaudoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LaudoUpdateComponent,
    resolve: {
      laudo: LaudoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LaudoUpdateComponent,
    resolve: {
      laudo: LaudoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(laudoRoute)],
  exports: [RouterModule],
})
export class LaudoRoutingModule {}
