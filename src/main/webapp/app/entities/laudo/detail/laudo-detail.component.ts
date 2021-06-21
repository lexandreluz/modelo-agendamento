import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILaudo } from '../laudo.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-laudo-detail',
  templateUrl: './laudo-detail.component.html',
})
export class LaudoDetailComponent implements OnInit {
  laudo: ILaudo | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ laudo }) => {
      this.laudo = laudo;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
