import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILaudo } from '../laudo.model';
import { LaudoService } from '../service/laudo.service';

@Component({
  templateUrl: './laudo-delete-dialog.component.html',
})
export class LaudoDeleteDialogComponent {
  laudo?: ILaudo;

  constructor(protected laudoService: LaudoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.laudoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
