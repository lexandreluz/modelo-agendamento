import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILaudo } from '../laudo.model';
import { LaudoService } from '../service/laudo.service';
import { LaudoDeleteDialogComponent } from '../delete/laudo-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-laudo',
  templateUrl: './laudo.component.html',
})
export class LaudoComponent implements OnInit {
  laudos?: ILaudo[];
  isLoading = false;

  constructor(protected laudoService: LaudoService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.laudoService.query().subscribe(
      (res: HttpResponse<ILaudo[]>) => {
        this.isLoading = false;
        this.laudos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILaudo): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(laudo: ILaudo): void {
    const modalRef = this.modalService.open(LaudoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.laudo = laudo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
