import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ConsultaService } from '../service/consulta.service';

import { ConsultaComponent } from './consulta.component';

describe('Component Tests', () => {
  describe('Consulta Management Component', () => {
    let comp: ConsultaComponent;
    let fixture: ComponentFixture<ConsultaComponent>;
    let service: ConsultaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ConsultaComponent],
      })
        .overrideTemplate(ConsultaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConsultaComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ConsultaService);

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
      expect(comp.consultas?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
