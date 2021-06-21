jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAgendamentoConsulta, AgendamentoConsulta } from '../agendamento-consulta.model';
import { AgendamentoConsultaService } from '../service/agendamento-consulta.service';

import { AgendamentoConsultaRoutingResolveService } from './agendamento-consulta-routing-resolve.service';

describe('Service Tests', () => {
  describe('AgendamentoConsulta routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AgendamentoConsultaRoutingResolveService;
    let service: AgendamentoConsultaService;
    let resultAgendamentoConsulta: IAgendamentoConsulta | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AgendamentoConsultaRoutingResolveService);
      service = TestBed.inject(AgendamentoConsultaService);
      resultAgendamentoConsulta = undefined;
    });

    describe('resolve', () => {
      it('should return IAgendamentoConsulta returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAgendamentoConsulta = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAgendamentoConsulta).toEqual({ id: 123 });
      });

      it('should return new IAgendamentoConsulta if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAgendamentoConsulta = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAgendamentoConsulta).toEqual(new AgendamentoConsulta());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAgendamentoConsulta = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAgendamentoConsulta).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
