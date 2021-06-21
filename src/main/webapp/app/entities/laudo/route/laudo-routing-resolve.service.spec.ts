jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILaudo, Laudo } from '../laudo.model';
import { LaudoService } from '../service/laudo.service';

import { LaudoRoutingResolveService } from './laudo-routing-resolve.service';

describe('Service Tests', () => {
  describe('Laudo routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: LaudoRoutingResolveService;
    let service: LaudoService;
    let resultLaudo: ILaudo | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(LaudoRoutingResolveService);
      service = TestBed.inject(LaudoService);
      resultLaudo = undefined;
    });

    describe('resolve', () => {
      it('should return ILaudo returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLaudo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLaudo).toEqual({ id: 123 });
      });

      it('should return new ILaudo if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLaudo = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultLaudo).toEqual(new Laudo());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLaudo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLaudo).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
