import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MedicoDetailComponent } from './medico-detail.component';

describe('Component Tests', () => {
  describe('Medico Management Detail Component', () => {
    let comp: MedicoDetailComponent;
    let fixture: ComponentFixture<MedicoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [MedicoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ medico: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(MedicoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(MedicoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load medico on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.medico).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
