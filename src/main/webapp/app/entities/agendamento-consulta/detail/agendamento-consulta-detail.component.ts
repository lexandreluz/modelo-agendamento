import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAgendamentoConsulta } from '../agendamento-consulta.model';

@Component({
  selector: 'jhi-agendamento-consulta-detail',
  templateUrl: './agendamento-consulta-detail.component.html',
})
export class AgendamentoConsultaDetailComponent implements OnInit {
  agendamentoConsulta: IAgendamentoConsulta | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agendamentoConsulta }) => {
      this.agendamentoConsulta = agendamentoConsulta;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
