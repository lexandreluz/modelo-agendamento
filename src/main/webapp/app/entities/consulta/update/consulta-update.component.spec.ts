jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ConsultaService } from '../service/consulta.service';
import { IConsulta, Consulta } from '../consulta.model';
import { IMedico } from 'app/entities/medico/medico.model';
import { MedicoService } from 'app/entities/medico/service/medico.service';
import { ILaudo } from 'app/entities/laudo/laudo.model';
import { LaudoService } from 'app/entities/laudo/service/laudo.service';

import { ConsultaUpdateComponent } from './consulta-update.component';

describe('Component Tests', () => {
  describe('Consulta Management Update Component', () => {
    let comp: ConsultaUpdateComponent;
    let fixture: ComponentFixture<ConsultaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let consultaService: ConsultaService;
    let medicoService: MedicoService;
    let laudoService: LaudoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ConsultaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ConsultaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConsultaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      consultaService = TestBed.inject(ConsultaService);
      medicoService = TestBed.inject(MedicoService);
      laudoService = TestBed.inject(LaudoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Medico query and add missing value', () => {
        const consulta: IConsulta = { id: 456 };
        const medico: IMedico = { id: 72715 };
        consulta.medico = medico;

        const medicoCollection: IMedico[] = [{ id: 41608 }];
        spyOn(medicoService, 'query').and.returnValue(of(new HttpResponse({ body: medicoCollection })));
        const additionalMedicos = [medico];
        const expectedCollection: IMedico[] = [...additionalMedicos, ...medicoCollection];
        spyOn(medicoService, 'addMedicoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ consulta });
        comp.ngOnInit();

        expect(medicoService.query).toHaveBeenCalled();
        expect(medicoService.addMedicoToCollectionIfMissing).toHaveBeenCalledWith(medicoCollection, ...additionalMedicos);
        expect(comp.medicosSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Laudo query and add missing value', () => {
        const consulta: IConsulta = { id: 456 };
        const laudo: ILaudo = { id: 25856 };
        consulta.laudo = laudo;

        const laudoCollection: ILaudo[] = [{ id: 70270 }];
        spyOn(laudoService, 'query').and.returnValue(of(new HttpResponse({ body: laudoCollection })));
        const additionalLaudos = [laudo];
        const expectedCollection: ILaudo[] = [...additionalLaudos, ...laudoCollection];
        spyOn(laudoService, 'addLaudoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ consulta });
        comp.ngOnInit();

        expect(laudoService.query).toHaveBeenCalled();
        expect(laudoService.addLaudoToCollectionIfMissing).toHaveBeenCalledWith(laudoCollection, ...additionalLaudos);
        expect(comp.laudosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const consulta: IConsulta = { id: 456 };
        const medico: IMedico = { id: 37491 };
        consulta.medico = medico;
        const laudo: ILaudo = { id: 35476 };
        consulta.laudo = laudo;

        activatedRoute.data = of({ consulta });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(consulta));
        expect(comp.medicosSharedCollection).toContain(medico);
        expect(comp.laudosSharedCollection).toContain(laudo);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const consulta = { id: 123 };
        spyOn(consultaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ consulta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: consulta }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(consultaService.update).toHaveBeenCalledWith(consulta);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const consulta = new Consulta();
        spyOn(consultaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ consulta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: consulta }));
        saveSubject.complete();

        // THEN
        expect(consultaService.create).toHaveBeenCalledWith(consulta);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const consulta = { id: 123 };
        spyOn(consultaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ consulta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(consultaService.update).toHaveBeenCalledWith(consulta);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackMedicoById', () => {
        it('Should return tracked Medico primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMedicoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackLaudoById', () => {
        it('Should return tracked Laudo primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLaudoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
