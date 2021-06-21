import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AgendamentoConsultaDetailComponent } from './agendamento-consulta-detail.component';

describe('Component Tests', () => {
  describe('AgendamentoConsulta Management Detail Component', () => {
    let comp: AgendamentoConsultaDetailComponent;
    let fixture: ComponentFixture<AgendamentoConsultaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AgendamentoConsultaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ agendamentoConsulta: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AgendamentoConsultaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AgendamentoConsultaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load agendamentoConsulta on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.agendamentoConsulta).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
