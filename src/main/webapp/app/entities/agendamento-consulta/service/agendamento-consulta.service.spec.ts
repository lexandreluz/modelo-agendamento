import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Convenio } from 'app/entities/enumerations/convenio.model';
import { TipoAgendamento } from 'app/entities/enumerations/tipo-agendamento.model';
import { Procedimento } from 'app/entities/enumerations/procedimento.model';
import { Status } from 'app/entities/enumerations/status.model';
import { IAgendamentoConsulta, AgendamentoConsulta } from '../agendamento-consulta.model';

import { AgendamentoConsultaService } from './agendamento-consulta.service';

describe('Service Tests', () => {
  describe('AgendamentoConsulta Service', () => {
    let service: AgendamentoConsultaService;
    let httpMock: HttpTestingController;
    let elemDefault: IAgendamentoConsulta;
    let expectedResult: IAgendamentoConsulta | IAgendamentoConsulta[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AgendamentoConsultaService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        idAgendamento: 0,
        convenio: Convenio.BANCARIO,
        tipoAgendamento: TipoAgendamento.EMERGENCIA,
        procedimento: Procedimento.CONSULTA,
        dataHora: currentDate,
        statusAgendamento: Status.CONCLUIDO,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dataHora: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a AgendamentoConsulta', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dataHora: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataHora: currentDate,
          },
          returnedFromService
        );

        service.create(new AgendamentoConsulta()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a AgendamentoConsulta', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idAgendamento: 1,
            convenio: 'BBBBBB',
            tipoAgendamento: 'BBBBBB',
            procedimento: 'BBBBBB',
            dataHora: currentDate.format(DATE_TIME_FORMAT),
            statusAgendamento: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataHora: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a AgendamentoConsulta', () => {
        const patchObject = Object.assign(
          {
            convenio: 'BBBBBB',
            tipoAgendamento: 'BBBBBB',
            procedimento: 'BBBBBB',
            dataHora: currentDate.format(DATE_TIME_FORMAT),
            statusAgendamento: 'BBBBBB',
          },
          new AgendamentoConsulta()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dataHora: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of AgendamentoConsulta', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            idAgendamento: 1,
            convenio: 'BBBBBB',
            tipoAgendamento: 'BBBBBB',
            procedimento: 'BBBBBB',
            dataHora: currentDate.format(DATE_TIME_FORMAT),
            statusAgendamento: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataHora: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a AgendamentoConsulta', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAgendamentoConsultaToCollectionIfMissing', () => {
        it('should add a AgendamentoConsulta to an empty array', () => {
          const agendamentoConsulta: IAgendamentoConsulta = { id: 123 };
          expectedResult = service.addAgendamentoConsultaToCollectionIfMissing([], agendamentoConsulta);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(agendamentoConsulta);
        });

        it('should not add a AgendamentoConsulta to an array that contains it', () => {
          const agendamentoConsulta: IAgendamentoConsulta = { id: 123 };
          const agendamentoConsultaCollection: IAgendamentoConsulta[] = [
            {
              ...agendamentoConsulta,
            },
            { id: 456 },
          ];
          expectedResult = service.addAgendamentoConsultaToCollectionIfMissing(agendamentoConsultaCollection, agendamentoConsulta);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a AgendamentoConsulta to an array that doesn't contain it", () => {
          const agendamentoConsulta: IAgendamentoConsulta = { id: 123 };
          const agendamentoConsultaCollection: IAgendamentoConsulta[] = [{ id: 456 }];
          expectedResult = service.addAgendamentoConsultaToCollectionIfMissing(agendamentoConsultaCollection, agendamentoConsulta);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(agendamentoConsulta);
        });

        it('should add only unique AgendamentoConsulta to an array', () => {
          const agendamentoConsultaArray: IAgendamentoConsulta[] = [{ id: 123 }, { id: 456 }, { id: 14050 }];
          const agendamentoConsultaCollection: IAgendamentoConsulta[] = [{ id: 123 }];
          expectedResult = service.addAgendamentoConsultaToCollectionIfMissing(agendamentoConsultaCollection, ...agendamentoConsultaArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const agendamentoConsulta: IAgendamentoConsulta = { id: 123 };
          const agendamentoConsulta2: IAgendamentoConsulta = { id: 456 };
          expectedResult = service.addAgendamentoConsultaToCollectionIfMissing([], agendamentoConsulta, agendamentoConsulta2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(agendamentoConsulta);
          expect(expectedResult).toContain(agendamentoConsulta2);
        });

        it('should accept null and undefined values', () => {
          const agendamentoConsulta: IAgendamentoConsulta = { id: 123 };
          expectedResult = service.addAgendamentoConsultaToCollectionIfMissing([], null, agendamentoConsulta, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(agendamentoConsulta);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
