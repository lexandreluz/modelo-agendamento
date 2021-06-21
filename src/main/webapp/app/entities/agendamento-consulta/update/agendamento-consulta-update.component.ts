import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAgendamentoConsulta, AgendamentoConsulta } from '../agendamento-consulta.model';
import { AgendamentoConsultaService } from '../service/agendamento-consulta.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { IMedico } from 'app/entities/medico/medico.model';
import { MedicoService } from 'app/entities/medico/service/medico.service';

@Component({
  selector: 'jhi-agendamento-consulta-update',
  templateUrl: './agendamento-consulta-update.component.html',
})
export class AgendamentoConsultaUpdateComponent implements OnInit {
  isSaving = false;

  usuariosSharedCollection: IUsuario[] = [];
  medicosSharedCollection: IMedico[] = [];

  editForm = this.fb.group({
    id: [],
    idAgendamento: [null, [Validators.required]],
    convenio: [],
    tipoAgendamento: [],
    procedimento: [],
    dataHora: [],
    statusAgendamento: [],
    usuario: [],
    medico: [],
  });

  constructor(
    protected agendamentoConsultaService: AgendamentoConsultaService,
    protected usuarioService: UsuarioService,
    protected medicoService: MedicoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agendamentoConsulta }) => {
      if (agendamentoConsulta.id === undefined) {
        const today = dayjs().startOf('day');
        agendamentoConsulta.dataHora = today;
      }

      this.updateForm(agendamentoConsulta);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const agendamentoConsulta = this.createFromForm();
    if (agendamentoConsulta.id !== undefined) {
      this.subscribeToSaveResponse(this.agendamentoConsultaService.update(agendamentoConsulta));
    } else {
      this.subscribeToSaveResponse(this.agendamentoConsultaService.create(agendamentoConsulta));
    }
  }

  trackUsuarioById(index: number, item: IUsuario): number {
    return item.id!;
  }

  trackMedicoById(index: number, item: IMedico): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgendamentoConsulta>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(agendamentoConsulta: IAgendamentoConsulta): void {
    this.editForm.patchValue({
      id: agendamentoConsulta.id,
      idAgendamento: agendamentoConsulta.idAgendamento,
      convenio: agendamentoConsulta.convenio,
      tipoAgendamento: agendamentoConsulta.tipoAgendamento,
      procedimento: agendamentoConsulta.procedimento,
      dataHora: agendamentoConsulta.dataHora ? agendamentoConsulta.dataHora.format(DATE_TIME_FORMAT) : null,
      statusAgendamento: agendamentoConsulta.statusAgendamento,
      usuario: agendamentoConsulta.usuario,
      medico: agendamentoConsulta.medico,
    });

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing(
      this.usuariosSharedCollection,
      agendamentoConsulta.usuario
    );
    this.medicosSharedCollection = this.medicoService.addMedicoToCollectionIfMissing(
      this.medicosSharedCollection,
      agendamentoConsulta.medico
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(
        map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing(usuarios, this.editForm.get('usuario')!.value))
      )
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));

    this.medicoService
      .query()
      .pipe(map((res: HttpResponse<IMedico[]>) => res.body ?? []))
      .pipe(map((medicos: IMedico[]) => this.medicoService.addMedicoToCollectionIfMissing(medicos, this.editForm.get('medico')!.value)))
      .subscribe((medicos: IMedico[]) => (this.medicosSharedCollection = medicos));
  }

  protected createFromForm(): IAgendamentoConsulta {
    return {
      ...new AgendamentoConsulta(),
      id: this.editForm.get(['id'])!.value,
      idAgendamento: this.editForm.get(['idAgendamento'])!.value,
      convenio: this.editForm.get(['convenio'])!.value,
      tipoAgendamento: this.editForm.get(['tipoAgendamento'])!.value,
      procedimento: this.editForm.get(['procedimento'])!.value,
      dataHora: this.editForm.get(['dataHora'])!.value ? dayjs(this.editForm.get(['dataHora'])!.value, DATE_TIME_FORMAT) : undefined,
      statusAgendamento: this.editForm.get(['statusAgendamento'])!.value,
      usuario: this.editForm.get(['usuario'])!.value,
      medico: this.editForm.get(['medico'])!.value,
    };
  }
}
