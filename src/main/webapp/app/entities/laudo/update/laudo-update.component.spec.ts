jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LaudoService } from '../service/laudo.service';
import { ILaudo, Laudo } from '../laudo.model';

import { LaudoUpdateComponent } from './laudo-update.component';

describe('Component Tests', () => {
  describe('Laudo Management Update Component', () => {
    let comp: LaudoUpdateComponent;
    let fixture: ComponentFixture<LaudoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let laudoService: LaudoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LaudoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LaudoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LaudoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      laudoService = TestBed.inject(LaudoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const laudo: ILaudo = { id: 456 };

        activatedRoute.data = of({ laudo });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(laudo));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const laudo = { id: 123 };
        spyOn(laudoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ laudo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: laudo }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(laudoService.update).toHaveBeenCalledWith(laudo);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const laudo = new Laudo();
        spyOn(laudoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ laudo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: laudo }));
        saveSubject.complete();

        // THEN
        expect(laudoService.create).toHaveBeenCalledWith(laudo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const laudo = { id: 123 };
        spyOn(laudoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ laudo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(laudoService.update).toHaveBeenCalledWith(laudo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
