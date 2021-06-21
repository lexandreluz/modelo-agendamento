import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAgendamentoConsulta } from '../agendamento-consulta.model';
import { AgendamentoConsultaService } from '../service/agendamento-consulta.service';
import { AgendamentoConsultaDeleteDialogComponent } from '../delete/agendamento-consulta-delete-dialog.component';

@Component({
  selector: 'jhi-agendamento-consulta',
  templateUrl: './agendamento-consulta.component.html',
})
export class AgendamentoConsultaComponent implements OnInit {
  agendamentoConsultas?: IAgendamentoConsulta[];
  isLoading = false;

  constructor(protected agendamentoConsultaService: AgendamentoConsultaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.agendamentoConsultaService.query().subscribe(
      (res: HttpResponse<IAgendamentoConsulta[]>) => {
        this.isLoading = false;
        this.agendamentoConsultas = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAgendamentoConsulta): number {
    return item.id!;
  }

  delete(agendamentoConsulta: IAgendamentoConsulta): void {
    const modalRef = this.modalService.open(AgendamentoConsultaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.agendamentoConsulta = agendamentoConsulta;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
