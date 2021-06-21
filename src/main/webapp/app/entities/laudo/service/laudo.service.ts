import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILaudo, getLaudoIdentifier } from '../laudo.model';

export type EntityResponseType = HttpResponse<ILaudo>;
export type EntityArrayResponseType = HttpResponse<ILaudo[]>;

@Injectable({ providedIn: 'root' })
export class LaudoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/laudos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(laudo: ILaudo): Observable<EntityResponseType> {
    return this.http.post<ILaudo>(this.resourceUrl, laudo, { observe: 'response' });
  }

  update(laudo: ILaudo): Observable<EntityResponseType> {
    return this.http.put<ILaudo>(`${this.resourceUrl}/${getLaudoIdentifier(laudo) as number}`, laudo, { observe: 'response' });
  }

  partialUpdate(laudo: ILaudo): Observable<EntityResponseType> {
    return this.http.patch<ILaudo>(`${this.resourceUrl}/${getLaudoIdentifier(laudo) as number}`, laudo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILaudo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILaudo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLaudoToCollectionIfMissing(laudoCollection: ILaudo[], ...laudosToCheck: (ILaudo | null | undefined)[]): ILaudo[] {
    const laudos: ILaudo[] = laudosToCheck.filter(isPresent);
    if (laudos.length > 0) {
      const laudoCollectionIdentifiers = laudoCollection.map(laudoItem => getLaudoIdentifier(laudoItem)!);
      const laudosToAdd = laudos.filter(laudoItem => {
        const laudoIdentifier = getLaudoIdentifier(laudoItem);
        if (laudoIdentifier == null || laudoCollectionIdentifiers.includes(laudoIdentifier)) {
          return false;
        }
        laudoCollectionIdentifiers.push(laudoIdentifier);
        return true;
      });
      return [...laudosToAdd, ...laudoCollection];
    }
    return laudoCollection;
  }
}
