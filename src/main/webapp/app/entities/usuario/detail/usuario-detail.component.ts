import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUsuario } from '../usuario.model';

@Component({
  selector: 'jhi-usuario-detail',
  templateUrl: './usuario-detail.component.html',
})
export class UsuarioDetailComponent implements OnInit {
  usuario: IUsuario | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ usuario }) => {
      this.usuario = usuario;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
