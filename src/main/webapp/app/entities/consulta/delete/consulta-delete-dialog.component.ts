import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConsulta } from '../consulta.model';
import { ConsultaService } from '../service/consulta.service';

@Component({
  templateUrl: './consulta-delete-dialog.component.html',
})
export class ConsultaDeleteDialogComponent {
  consulta?: IConsulta;

  constructor(protected consultaService: ConsultaService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.consultaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
