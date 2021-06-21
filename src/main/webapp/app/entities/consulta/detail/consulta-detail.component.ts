import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConsulta } from '../consulta.model';

@Component({
  selector: 'jhi-consulta-detail',
  templateUrl: './consulta-detail.component.html',
})
export class ConsultaDetailComponent implements OnInit {
  consulta: IConsulta | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consulta }) => {
      this.consulta = consulta;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
