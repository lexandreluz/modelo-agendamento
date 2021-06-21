import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UsuarioDetailComponent } from './usuario-detail.component';

describe('Component Tests', () => {
  describe('Usuario Management Detail Component', () => {
    let comp: UsuarioDetailComponent;
    let fixture: ComponentFixture<UsuarioDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UsuarioDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ usuario: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(UsuarioDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UsuarioDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load usuario on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.usuario).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
