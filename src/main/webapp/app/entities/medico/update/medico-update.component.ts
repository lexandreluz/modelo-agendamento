import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IMedico, Medico } from '../medico.model';
import { MedicoService } from '../service/medico.service';

@Component({
  selector: 'jhi-medico-update',
  templateUrl: './medico-update.component.html',
})
export class MedicoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    crm: [null, [Validators.required]],
    nome: [],
    telefone: [],
    especialidade: [],
  });

  constructor(protected medicoService: MedicoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ medico }) => {
      this.updateForm(medico);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const medico = this.createFromForm();
    if (medico.id !== undefined) {
      this.subscribeToSaveResponse(this.medicoService.update(medico));
    } else {
      this.subscribeToSaveResponse(this.medicoService.create(medico));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedico>>): void {
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

  protected updateForm(medico: IMedico): void {
    this.editForm.patchValue({
      id: medico.id,
      crm: medico.crm,
      nome: medico.nome,
      telefone: medico.telefone,
      especialidade: medico.especialidade,
    });
  }

  protected createFromForm(): IMedico {
    return {
      ...new Medico(),
      id: this.editForm.get(['id'])!.value,
      crm: this.editForm.get(['crm'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      telefone: this.editForm.get(['telefone'])!.value,
      especialidade: this.editForm.get(['especialidade'])!.value,
    };
  }
}
