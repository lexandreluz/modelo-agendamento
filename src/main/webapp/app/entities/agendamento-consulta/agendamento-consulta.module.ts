import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { AgendamentoConsultaComponent } from './list/agendamento-consulta.component';
import { AgendamentoConsultaDetailComponent } from './detail/agendamento-consulta-detail.component';
import { AgendamentoConsultaUpdateComponent } from './update/agendamento-consulta-update.component';
import { AgendamentoConsultaDeleteDialogComponent } from './delete/agendamento-consulta-delete-dialog.component';
import { AgendamentoConsultaRoutingModule } from './route/agendamento-consulta-routing.module';

@NgModule({
  imports: [SharedModule, AgendamentoConsultaRoutingModule],
  declarations: [
    AgendamentoConsultaComponent,
    AgendamentoConsultaDetailComponent,
    AgendamentoConsultaUpdateComponent,
    AgendamentoConsultaDeleteDialogComponent,
  ],
  entryComponents: [AgendamentoConsultaDeleteDialogComponent],
})
export class AgendamentoConsultaModule {}
