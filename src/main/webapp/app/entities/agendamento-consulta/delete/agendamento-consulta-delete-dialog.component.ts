import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAgendamentoConsulta } from '../agendamento-consulta.model';
import { AgendamentoConsultaService } from '../service/agendamento-consulta.service';

@Component({
  templateUrl: './agendamento-consulta-delete-dialog.component.html',
})
export class AgendamentoConsultaDeleteDialogComponent {
  agendamentoConsulta?: IAgendamentoConsulta;

  constructor(protected agendamentoConsultaService: AgendamentoConsultaService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.agendamentoConsultaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
