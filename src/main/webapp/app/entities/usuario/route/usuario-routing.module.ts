import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UsuarioComponent } from '../list/usuario.component';
import { UsuarioDetailComponent } from '../detail/usuario-detail.component';
import { UsuarioUpdateComponent } from '../update/usuario-update.component';
import { UsuarioRoutingResolveService } from './usuario-routing-resolve.service';

const usuarioRoute: Routes = [
  {
    path: '',
    component: UsuarioComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UsuarioDetailComponent,
    resolve: {
      usuario: UsuarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UsuarioUpdateComponent,
    resolve: {
      usuario: UsuarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UsuarioUpdateComponent,
    resolve: {
      usuario: UsuarioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(usuarioRoute)],
  exports: [RouterModule],
})
export class UsuarioRoutingModule {}
