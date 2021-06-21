import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ConsultaComponent } from './list/consulta.component';
import { ConsultaDetailComponent } from './detail/consulta-detail.component';
import { ConsultaUpdateComponent } from './update/consulta-update.component';
import { ConsultaDeleteDialogComponent } from './delete/consulta-delete-dialog.component';
import { ConsultaRoutingModule } from './route/consulta-routing.module';

@NgModule({
  imports: [SharedModule, ConsultaRoutingModule],
  declarations: [ConsultaComponent, ConsultaDetailComponent, ConsultaUpdateComponent, ConsultaDeleteDialogComponent],
  entryComponents: [ConsultaDeleteDialogComponent],
})
export class ConsultaModule {}
