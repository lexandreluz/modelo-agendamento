import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMedico, getMedicoIdentifier } from '../medico.model';

export type EntityResponseType = HttpResponse<IMedico>;
export type EntityArrayResponseType = HttpResponse<IMedico[]>;

@Injectable({ providedIn: 'root' })
export class MedicoService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/medicos');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(medico: IMedico): Observable<EntityResponseType> {
    return this.http.post<IMedico>(this.resourceUrl, medico, { observe: 'response' });
  }

  update(medico: IMedico): Observable<EntityResponseType> {
    return this.http.put<IMedico>(`${this.resourceUrl}/${getMedicoIdentifier(medico) as number}`, medico, { observe: 'response' });
  }

  partialUpdate(medico: IMedico): Observable<EntityResponseType> {
    return this.http.patch<IMedico>(`${this.resourceUrl}/${getMedicoIdentifier(medico) as number}`, medico, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMedico>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMedico[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMedicoToCollectionIfMissing(medicoCollection: IMedico[], ...medicosToCheck: (IMedico | null | undefined)[]): IMedico[] {
    const medicos: IMedico[] = medicosToCheck.filter(isPresent);
    if (medicos.length > 0) {
      const medicoCollectionIdentifiers = medicoCollection.map(medicoItem => getMedicoIdentifier(medicoItem)!);
      const medicosToAdd = medicos.filter(medicoItem => {
        const medicoIdentifier = getMedicoIdentifier(medicoItem);
        if (medicoIdentifier == null || medicoCollectionIdentifiers.includes(medicoIdentifier)) {
          return false;
        }
        medicoCollectionIdentifiers.push(medicoIdentifier);
        return true;
      });
      return [...medicosToAdd, ...medicoCollection];
    }
    return medicoCollection;
  }
}
