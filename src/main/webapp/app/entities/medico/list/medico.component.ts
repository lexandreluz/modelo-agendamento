import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedico } from '../medico.model';
import { MedicoService } from '../service/medico.service';
import { MedicoDeleteDialogComponent } from '../delete/medico-delete-dialog.component';

@Component({
  selector: 'jhi-medico',
  templateUrl: './medico.component.html',
})
export class MedicoComponent implements OnInit {
  medicos?: IMedico[];
  isLoading = false;

  constructor(protected medicoService: MedicoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.medicoService.query().subscribe(
      (res: HttpResponse<IMedico[]>) => {
        this.isLoading = false;
        this.medicos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMedico): number {
    return item.id!;
  }

  delete(medico: IMedico): void {
    const modalRef = this.modalService.open(MedicoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.medico = medico;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
