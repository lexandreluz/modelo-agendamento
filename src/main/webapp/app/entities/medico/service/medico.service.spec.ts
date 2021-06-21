import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Especialicacao } from 'app/entities/enumerations/especialicacao.model';
import { IMedico, Medico } from '../medico.model';

import { MedicoService } from './medico.service';

describe('Service Tests', () => {
  describe('Medico Service', () => {
    let service: MedicoService;
    let httpMock: HttpTestingController;
    let elemDefault: IMedico;
    let expectedResult: IMedico | IMedico[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(MedicoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        crm: 'AAAAAAA',
        nome: 'AAAAAAA',
        telefone: 'AAAAAAA',
        especialidade: Especialicacao.CLINICA_GERAL,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Medico', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Medico()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Medico', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            crm: 'BBBBBB',
            nome: 'BBBBBB',
            telefone: 'BBBBBB',
            especialidade: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Medico', () => {
        const patchObject = Object.assign(
          {
            telefone: 'BBBBBB',
          },
          new Medico()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Medico', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            crm: 'BBBBBB',
            nome: 'BBBBBB',
            telefone: 'BBBBBB',
            especialidade: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Medico', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addMedicoToCollectionIfMissing', () => {
        it('should add a Medico to an empty array', () => {
          const medico: IMedico = { id: 123 };
          expectedResult = service.addMedicoToCollectionIfMissing([], medico);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(medico);
        });

        it('should not add a Medico to an array that contains it', () => {
          const medico: IMedico = { id: 123 };
          const medicoCollection: IMedico[] = [
            {
              ...medico,
            },
            { id: 456 },
          ];
          expectedResult = service.addMedicoToCollectionIfMissing(medicoCollection, medico);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Medico to an array that doesn't contain it", () => {
          const medico: IMedico = { id: 123 };
          const medicoCollection: IMedico[] = [{ id: 456 }];
          expectedResult = service.addMedicoToCollectionIfMissing(medicoCollection, medico);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(medico);
        });

        it('should add only unique Medico to an array', () => {
          const medicoArray: IMedico[] = [{ id: 123 }, { id: 456 }, { id: 51053 }];
          const medicoCollection: IMedico[] = [{ id: 123 }];
          expectedResult = service.addMedicoToCollectionIfMissing(medicoCollection, ...medicoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const medico: IMedico = { id: 123 };
          const medico2: IMedico = { id: 456 };
          expectedResult = service.addMedicoToCollectionIfMissing([], medico, medico2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(medico);
          expect(expectedResult).toContain(medico2);
        });

        it('should accept null and undefined values', () => {
          const medico: IMedico = { id: 123 };
          expectedResult = service.addMedicoToCollectionIfMissing([], null, medico, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(medico);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
