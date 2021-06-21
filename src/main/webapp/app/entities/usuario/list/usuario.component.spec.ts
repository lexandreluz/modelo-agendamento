import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { UsuarioService } from '../service/usuario.service';

import { UsuarioComponent } from './usuario.component';

describe('Component Tests', () => {
  describe('Usuario Management Component', () => {
    let comp: UsuarioComponent;
    let fixture: ComponentFixture<UsuarioComponent>;
    let service: UsuarioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UsuarioComponent],
      })
        .overrideTemplate(UsuarioComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UsuarioComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(UsuarioService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.usuarios?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
