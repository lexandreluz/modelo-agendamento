import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMedico } from '../medico.model';

@Component({
  selector: 'jhi-medico-detail',
  templateUrl: './medico-detail.component.html',
})
export class MedicoDetailComponent implements OnInit {
  medico: IMedico | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medico }) => {
      this.medico = medico;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
