import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IConsulta } from '../consulta.model';
import { ConsultaService } from '../service/consulta.service';
import { ConsultaDeleteDialogComponent } from '../delete/consulta-delete-dialog.component';

@Component({
  selector: 'jhi-consulta',
  templateUrl: './consulta.component.html',
})
export class ConsultaComponent implements OnInit {
  consultas?: IConsulta[];
  isLoading = false;

  constructor(protected consultaService: ConsultaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.consultaService.query().subscribe(
      (res: HttpResponse<IConsulta[]>) => {
        this.isLoading = false;
        this.consultas = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IConsulta): number {
    return item.id!;
  }

  delete(consulta: IConsulta): void {
    const modalRef = this.modalService.open(ConsultaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.consulta = consulta;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
