import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { UsuarioComponent } from './list/usuario.component';
import { UsuarioDetailComponent } from './detail/usuario-detail.component';
import { UsuarioUpdateComponent } from './update/usuario-update.component';
import { UsuarioDeleteDialogComponent } from './delete/usuario-delete-dialog.component';
import { UsuarioRoutingModule } from './route/usuario-routing.module';

@NgModule({
  imports: [SharedModule, UsuarioRoutingModule],
  declarations: [UsuarioComponent, UsuarioDetailComponent, UsuarioUpdateComponent, UsuarioDeleteDialogComponent],
  entryComponents: [UsuarioDeleteDialogComponent],
})
export class UsuarioModule {}
