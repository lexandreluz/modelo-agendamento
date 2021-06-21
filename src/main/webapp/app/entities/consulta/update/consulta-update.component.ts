import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IConsulta, Consulta } from '../consulta.model';
import { ConsultaService } from '../service/consulta.service';
import { IMedico } from 'app/entities/medico/medico.model';
import { MedicoService } from 'app/entities/medico/service/medico.service';
import { ILaudo } from 'app/entities/laudo/laudo.model';
import { LaudoService } from 'app/entities/laudo/service/laudo.service';

@Component({
  selector: 'jhi-consulta-update',
  templateUrl: './consulta-update.component.html',
})
export class ConsultaUpdateComponent implements OnInit {
  isSaving = false;

  medicosSharedCollection: IMedico[] = [];
  laudosSharedCollection: ILaudo[] = [];

  editForm = this.fb.group({
    id: [],
    procedimento: [],
    tipoConsulta: [],
    medico: [],
    laudo: [],
  });

  constructor(
    protected consultaService: ConsultaService,
    protected medicoService: MedicoService,
    protected laudoService: LaudoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consulta }) => {
      this.updateForm(consulta);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const consulta = this.createFromForm();
    if (consulta.id !== undefined) {
      this.subscribeToSaveResponse(this.consultaService.update(consulta));
    } else {
      this.subscribeToSaveResponse(this.consultaService.create(consulta));
    }
  }

  trackMedicoById(index: number, item: IMedico): number {
    return item.id!;
  }

  trackLaudoById(index: number, item: ILaudo): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConsulta>>): void {
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

  protected updateForm(consulta: IConsulta): void {
    this.editForm.patchValue({
      id: consulta.id,
      procedimento: consulta.procedimento,
      tipoConsulta: consulta.tipoConsulta,
      medico: consulta.medico,
      laudo: consulta.laudo,
    });

    this.medicosSharedCollection = this.medicoService.addMedicoToCollectionIfMissing(this.medicosSharedCollection, consulta.medico);
    this.laudosSharedCollection = this.laudoService.addLaudoToCollectionIfMissing(this.laudosSharedCollection, consulta.laudo);
  }

  protected loadRelationshipsOptions(): void {
    this.medicoService
      .query()
      .pipe(map((res: HttpResponse<IMedico[]>) => res.body ?? []))
      .pipe(map((medicos: IMedico[]) => this.medicoService.addMedicoToCollectionIfMissing(medicos, this.editForm.get('medico')!.value)))
      .subscribe((medicos: IMedico[]) => (this.medicosSharedCollection = medicos));

    this.laudoService
      .query()
      .pipe(map((res: HttpResponse<ILaudo[]>) => res.body ?? []))
      .pipe(map((laudos: ILaudo[]) => this.laudoService.addLaudoToCollectionIfMissing(laudos, this.editForm.get('laudo')!.value)))
      .subscribe((laudos: ILaudo[]) => (this.laudosSharedCollection = laudos));
  }

  protected createFromForm(): IConsulta {
    return {
      ...new Consulta(),
      id: this.editForm.get(['id'])!.value,
      procedimento: this.editForm.get(['procedimento'])!.value,
      tipoConsulta: this.editForm.get(['tipoConsulta'])!.value,
      medico: this.editForm.get(['medico'])!.value,
      laudo: this.editForm.get(['laudo'])!.value,
    };
  }
}
