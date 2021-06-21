import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUsuario, Usuario } from '../usuario.model';
import { UsuarioService } from '../service/usuario.service';

@Injectable({ providedIn: 'root' })
export class UsuarioRoutingResolveService implements Resolve<IUsuario> {
  constructor(protected service: UsuarioService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUsuario> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((usuario: HttpResponse<Usuario>) => {
          if (usuario.body) {
            return of(usuario.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Usuario());
  }
}
