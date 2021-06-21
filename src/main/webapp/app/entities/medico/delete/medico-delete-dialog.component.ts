import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedico } from '../medico.model';
import { MedicoService } from '../service/medico.service';

@Component({
  templateUrl: './medico-delete-dialog.component.html',
})
export class MedicoDeleteDialogComponent {
  medico?: IMedico;

  constructor(protected medicoService: MedicoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.medicoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
