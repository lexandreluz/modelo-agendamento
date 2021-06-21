import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILaudo, Laudo } from '../laudo.model';
import { LaudoService } from '../service/laudo.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-laudo-update',
  templateUrl: './laudo-update.component.html',
})
export class LaudoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    parecerMedico: [],
    encaminhamento: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected laudoService: LaudoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ laudo }) => {
      this.updateForm(laudo);
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('agendamentoMedicoApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const laudo = this.createFromForm();
    if (laudo.id !== undefined) {
      this.subscribeToSaveResponse(this.laudoService.update(laudo));
    } else {
      this.subscribeToSaveResponse(this.laudoService.create(laudo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILaudo>>): void {
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

  protected updateForm(laudo: ILaudo): void {
    this.editForm.patchValue({
      id: laudo.id,
      parecerMedico: laudo.parecerMedico,
      encaminhamento: laudo.encaminhamento,
    });
  }

  protected createFromForm(): ILaudo {
    return {
      ...new Laudo(),
      id: this.editForm.get(['id'])!.value,
      parecerMedico: this.editForm.get(['parecerMedico'])!.value,
      encaminhamento: this.editForm.get(['encaminhamento'])!.value,
    };
  }
}
