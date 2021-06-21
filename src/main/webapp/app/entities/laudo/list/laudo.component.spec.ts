import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LaudoService } from '../service/laudo.service';

import { LaudoComponent } from './laudo.component';

describe('Component Tests', () => {
  describe('Laudo Management Component', () => {
    let comp: LaudoComponent;
    let fixture: ComponentFixture<LaudoComponent>;
    let service: LaudoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LaudoComponent],
      })
        .overrideTemplate(LaudoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LaudoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LaudoService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.laudos?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
