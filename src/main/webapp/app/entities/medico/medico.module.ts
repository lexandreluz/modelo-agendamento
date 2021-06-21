import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { MedicoComponent } from './list/medico.component';
import { MedicoDetailComponent } from './detail/medico-detail.component';
import { MedicoUpdateComponent } from './update/medico-update.component';
import { MedicoDeleteDialogComponent } from './delete/medico-delete-dialog.component';
import { MedicoRoutingModule } from './route/medico-routing.module';

@NgModule({
  imports: [SharedModule, MedicoRoutingModule],
  declarations: [MedicoComponent, MedicoDetailComponent, MedicoUpdateComponent, MedicoDeleteDialogComponent],
  entryComponents: [MedicoDeleteDialogComponent],
})
export class MedicoModule {}
