import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConsulta, getConsultaIdentifier } from '../consulta.model';

export type EntityResponseType = HttpResponse<IConsulta>;
export type EntityArrayResponseType = HttpResponse<IConsulta[]>;

@Injectable({ providedIn: 'root' })
export class ConsultaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/consultas');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(consulta: IConsulta): Observable<EntityResponseType> {
    return this.http.post<IConsulta>(this.resourceUrl, consulta, { observe: 'response' });
  }

  update(consulta: IConsulta): Observable<EntityResponseType> {
    return this.http.put<IConsulta>(`${this.resourceUrl}/${getConsultaIdentifier(consulta) as number}`, consulta, { observe: 'response' });
  }

  partialUpdate(consulta: IConsulta): Observable<EntityResponseType> {
    return this.http.patch<IConsulta>(`${this.resourceUrl}/${getConsultaIdentifier(consulta) as number}`, consulta, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IConsulta>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IConsulta[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addConsultaToCollectionIfMissing(consultaCollection: IConsulta[], ...consultasToCheck: (IConsulta | null | undefined)[]): IConsulta[] {
    const consultas: IConsulta[] = consultasToCheck.filter(isPresent);
    if (consultas.length > 0) {
      const consultaCollectionIdentifiers = consultaCollection.map(consultaItem => getConsultaIdentifier(consultaItem)!);
      const consultasToAdd = consultas.filter(consultaItem => {
        const consultaIdentifier = getConsultaIdentifier(consultaItem);
        if (consultaIdentifier == null || consultaCollectionIdentifiers.includes(consultaIdentifier)) {
          return false;
        }
        consultaCollectionIdentifiers.push(consultaIdentifier);
        return true;
      });
      return [...consultasToAdd, ...consultaCollection];
    }
    return consultaCollection;
  }
}
