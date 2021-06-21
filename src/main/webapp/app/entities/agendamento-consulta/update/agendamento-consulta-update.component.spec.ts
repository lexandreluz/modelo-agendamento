jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AgendamentoConsultaService } from '../service/agendamento-consulta.service';
import { IAgendamentoConsulta, AgendamentoConsulta } from '../agendamento-consulta.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { IMedico } from 'app/entities/medico/medico.model';
import { MedicoService } from 'app/entities/medico/service/medico.service';

import { AgendamentoConsultaUpdateComponent } from './agendamento-consulta-update.component';

describe('Component Tests', () => {
  describe('AgendamentoConsulta Management Update Component', () => {
    let comp: AgendamentoConsultaUpdateComponent;
    let fixture: ComponentFixture<AgendamentoConsultaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let agendamentoConsultaService: AgendamentoConsultaService;
    let usuarioService: UsuarioService;
    let medicoService: MedicoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AgendamentoConsultaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AgendamentoConsultaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AgendamentoConsultaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      agendamentoConsultaService = TestBed.inject(AgendamentoConsultaService);
      usuarioService = TestBed.inject(UsuarioService);
      medicoService = TestBed.inject(MedicoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Usuario query and add missing value', () => {
        const agendamentoConsulta: IAgendamentoConsulta = { id: 456 };
        const usuario: IUsuario = { id: 26601 };
        agendamentoConsulta.usuario = usuario;

        const usuarioCollection: IUsuario[] = [{ id: 64792 }];
        spyOn(usuarioService, 'query').and.returnValue(of(new HttpResponse({ body: usuarioCollection })));
        const additionalUsuarios = [usuario];
        const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
        spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ agendamentoConsulta });
        comp.ngOnInit();

        expect(usuarioService.query).toHaveBeenCalled();
        expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(usuarioCollection, ...additionalUsuarios);
        expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Medico query and add missing value', () => {
        const agendamentoConsulta: IAgendamentoConsulta = { id: 456 };
        const medico: IMedico = { id: 60673 };
        agendamentoConsulta.medico = medico;

        const medicoCollection: IMedico[] = [{ id: 30588 }];
        spyOn(medicoService, 'query').and.returnValue(of(new HttpResponse({ body: medicoCollection })));
        const additionalMedicos = [medico];
        const expectedCollection: IMedico[] = [...additionalMedicos, ...medicoCollection];
        spyOn(medicoService, 'addMedicoToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ agendamentoConsulta });
        comp.ngOnInit();

        expect(medicoService.query).toHaveBeenCalled();
        expect(medicoService.addMedicoToCollectionIfMissing).toHaveBeenCalledWith(medicoCollection, ...additionalMedicos);
        expect(comp.medicosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const agendamentoConsulta: IAgendamentoConsulta = { id: 456 };
        const usuario: IUsuario = { id: 12688 };
        agendamentoConsulta.usuario = usuario;
        const medico: IMedico = { id: 28698 };
        agendamentoConsulta.medico = medico;

        activatedRoute.data = of({ agendamentoConsulta });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(agendamentoConsulta));
        expect(comp.usuariosSharedCollection).toContain(usuario);
        expect(comp.medicosSharedCollection).toContain(medico);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const agendamentoConsulta = { id: 123 };
        spyOn(agendamentoConsultaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ agendamentoConsulta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: agendamentoConsulta }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(agendamentoConsultaService.update).toHaveBeenCalledWith(agendamentoConsulta);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const agendamentoConsulta = new AgendamentoConsulta();
        spyOn(agendamentoConsultaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ agendamentoConsulta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: agendamentoConsulta }));
        saveSubject.complete();

        // THEN
        expect(agendamentoConsultaService.create).toHaveBeenCalledWith(agendamentoConsulta);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const agendamentoConsulta = { id: 123 };
        spyOn(agendamentoConsultaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ agendamentoConsulta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(agendamentoConsultaService.update).toHaveBeenCalledWith(agendamentoConsulta);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUsuarioById', () => {
        it('Should return tracked Usuario primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUsuarioById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackMedicoById', () => {
        it('Should return tracked Medico primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackMedicoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
