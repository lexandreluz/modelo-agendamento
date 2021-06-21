import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConsultaDetailComponent } from './consulta-detail.component';

describe('Component Tests', () => {
  describe('Consulta Management Detail Component', () => {
    let comp: ConsultaDetailComponent;
    let fixture: ComponentFixture<ConsultaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ConsultaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ consulta: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ConsultaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ConsultaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load consulta on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.consulta).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
