import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAgendamentoConsulta, getAgendamentoConsultaIdentifier } from '../agendamento-consulta.model';

export type EntityResponseType = HttpResponse<IAgendamentoConsulta>;
export type EntityArrayResponseType = HttpResponse<IAgendamentoConsulta[]>;

@Injectable({ providedIn: 'root' })
export class AgendamentoConsultaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/agendamento-consultas');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(agendamentoConsulta: IAgendamentoConsulta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agendamentoConsulta);
    return this.http
      .post<IAgendamentoConsulta>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(agendamentoConsulta: IAgendamentoConsulta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agendamentoConsulta);
    return this.http
      .put<IAgendamentoConsulta>(`${this.resourceUrl}/${getAgendamentoConsultaIdentifier(agendamentoConsulta) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(agendamentoConsulta: IAgendamentoConsulta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agendamentoConsulta);
    return this.http
      .patch<IAgendamentoConsulta>(`${this.resourceUrl}/${getAgendamentoConsultaIdentifier(agendamentoConsulta) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAgendamentoConsulta>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAgendamentoConsulta[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAgendamentoConsultaToCollectionIfMissing(
    agendamentoConsultaCollection: IAgendamentoConsulta[],
    ...agendamentoConsultasToCheck: (IAgendamentoConsulta | null | undefined)[]
  ): IAgendamentoConsulta[] {
    const agendamentoConsultas: IAgendamentoConsulta[] = agendamentoConsultasToCheck.filter(isPresent);
    if (agendamentoConsultas.length > 0) {
      const agendamentoConsultaCollectionIdentifiers = agendamentoConsultaCollection.map(
        agendamentoConsultaItem => getAgendamentoConsultaIdentifier(agendamentoConsultaItem)!
      );
      const agendamentoConsultasToAdd = agendamentoConsultas.filter(agendamentoConsultaItem => {
        const agendamentoConsultaIdentifier = getAgendamentoConsultaIdentifier(agendamentoConsultaItem);
        if (agendamentoConsultaIdentifier == null || agendamentoConsultaCollectionIdentifiers.includes(agendamentoConsultaIdentifier)) {
          return false;
        }
        agendamentoConsultaCollectionIdentifiers.push(agendamentoConsultaIdentifier);
        return true;
      });
      return [...agendamentoConsultasToAdd, ...agendamentoConsultaCollection];
    }
    return agendamentoConsultaCollection;
  }

  protected convertDateFromClient(agendamentoConsulta: IAgendamentoConsulta): IAgendamentoConsulta {
    return Object.assign({}, agendamentoConsulta, {
      dataHora: agendamentoConsulta.dataHora?.isValid() ? agendamentoConsulta.dataHora.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dataHora = res.body.dataHora ? dayjs(res.body.dataHora) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((agendamentoConsulta: IAgendamentoConsulta) => {
        agendamentoConsulta.dataHora = agendamentoConsulta.dataHora ? dayjs(agendamentoConsulta.dataHora) : undefined;
      });
    }
    return res;
  }
}
