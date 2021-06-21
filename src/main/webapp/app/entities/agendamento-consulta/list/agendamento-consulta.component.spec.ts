import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AgendamentoConsultaService } from '../service/agendamento-consulta.service';

import { AgendamentoConsultaComponent } from './agendamento-consulta.component';

describe('Component Tests', () => {
  describe('AgendamentoConsulta Management Component', () => {
    let comp: AgendamentoConsultaComponent;
    let fixture: ComponentFixture<AgendamentoConsultaComponent>;
    let service: AgendamentoConsultaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AgendamentoConsultaComponent],
      })
        .overrideTemplate(AgendamentoConsultaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AgendamentoConsultaComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AgendamentoConsultaService);

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
      expect(comp.agendamentoConsultas?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
