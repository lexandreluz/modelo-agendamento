import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { LaudoComponent } from './list/laudo.component';
import { LaudoDetailComponent } from './detail/laudo-detail.component';
import { LaudoUpdateComponent } from './update/laudo-update.component';
import { LaudoDeleteDialogComponent } from './delete/laudo-delete-dialog.component';
import { LaudoRoutingModule } from './route/laudo-routing.module';

@NgModule({
  imports: [SharedModule, LaudoRoutingModule],
  declarations: [LaudoComponent, LaudoDetailComponent, LaudoUpdateComponent, LaudoDeleteDialogComponent],
  entryComponents: [LaudoDeleteDialogComponent],
})
export class LaudoModule {}
