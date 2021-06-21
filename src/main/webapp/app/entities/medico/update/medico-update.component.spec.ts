jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { MedicoService } from '../service/medico.service';
import { IMedico, Medico } from '../medico.model';

import { MedicoUpdateComponent } from './medico-update.component';

describe('Component Tests', () => {
  describe('Medico Management Update Component', () => {
    let comp: MedicoUpdateComponent;
    let fixture: ComponentFixture<MedicoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let medicoService: MedicoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [MedicoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(MedicoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(MedicoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      medicoService = TestBed.inject(MedicoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const medico: IMedico = { id: 456 };

        activatedRoute.data = of({ medico });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(medico));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const medico = { id: 123 };
        spyOn(medicoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ medico });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medico }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(medicoService.update).toHaveBeenCalledWith(medico);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const medico = new Medico();
        spyOn(medicoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ medico });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: medico }));
        saveSubject.complete();

        // THEN
        expect(medicoService.create).toHaveBeenCalledWith(medico);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const medico = { id: 123 };
        spyOn(medicoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ medico });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(medicoService.update).toHaveBeenCalledWith(medico);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
