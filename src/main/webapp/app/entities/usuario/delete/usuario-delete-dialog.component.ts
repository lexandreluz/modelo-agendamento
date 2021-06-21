import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUsuario } from '../usuario.model';
import { UsuarioService } from '../service/usuario.service';

@Component({
  templateUrl: './usuario-delete-dialog.component.html',
})
export class UsuarioDeleteDialogComponent {
  usuario?: IUsuario;

  constructor(protected usuarioService: UsuarioService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.usuarioService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
