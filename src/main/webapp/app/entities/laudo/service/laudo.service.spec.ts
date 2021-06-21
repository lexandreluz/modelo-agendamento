import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILaudo, Laudo } from '../laudo.model';

import { LaudoService } from './laudo.service';

describe('Service Tests', () => {
  describe('Laudo Service', () => {
    let service: LaudoService;
    let httpMock: HttpTestingController;
    let elemDefault: ILaudo;
    let expectedResult: ILaudo | ILaudo[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LaudoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        parecerMedico: 'AAAAAAA',
        encaminhamento: 'AAAAAAA',
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

      it('should create a Laudo', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Laudo()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Laudo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            parecerMedico: 'BBBBBB',
            encaminhamento: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Laudo', () => {
        const patchObject = Object.assign(
          {
            encaminhamento: 'BBBBBB',
          },
          new Laudo()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Laudo', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            parecerMedico: 'BBBBBB',
            encaminhamento: 'BBBBBB',
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

      it('should delete a Laudo', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLaudoToCollectionIfMissing', () => {
        it('should add a Laudo to an empty array', () => {
          const laudo: ILaudo = { id: 123 };
          expectedResult = service.addLaudoToCollectionIfMissing([], laudo);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(laudo);
        });

        it('should not add a Laudo to an array that contains it', () => {
          const laudo: ILaudo = { id: 123 };
          const laudoCollection: ILaudo[] = [
            {
              ...laudo,
            },
            { id: 456 },
          ];
          expectedResult = service.addLaudoToCollectionIfMissing(laudoCollection, laudo);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Laudo to an array that doesn't contain it", () => {
          const laudo: ILaudo = { id: 123 };
          const laudoCollection: ILaudo[] = [{ id: 456 }];
          expectedResult = service.addLaudoToCollectionIfMissing(laudoCollection, laudo);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(laudo);
        });

        it('should add only unique Laudo to an array', () => {
          const laudoArray: ILaudo[] = [{ id: 123 }, { id: 456 }, { id: 35476 }];
          const laudoCollection: ILaudo[] = [{ id: 123 }];
          expectedResult = service.addLaudoToCollectionIfMissing(laudoCollection, ...laudoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const laudo: ILaudo = { id: 123 };
          const laudo2: ILaudo = { id: 456 };
          expectedResult = service.addLaudoToCollectionIfMissing([], laudo, laudo2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(laudo);
          expect(expectedResult).toContain(laudo2);
        });

        it('should accept null and undefined values', () => {
          const laudo: ILaudo = { id: 123 };
          expectedResult = service.addLaudoToCollectionIfMissing([], null, laudo, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(laudo);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
