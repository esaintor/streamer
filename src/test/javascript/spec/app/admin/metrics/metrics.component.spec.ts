import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { StreamerTestModule } from '../../../test.module';
import { AppMetricsMonitoringComponent } from 'app/admin/metrics/metrics.component';
import { AppMetricsService } from 'app/admin/metrics/metrics.service';

describe('Component Tests', () => {
  describe('AppMetricsMonitoringComponent', () => {
    let comp: AppMetricsMonitoringComponent;
    let fixture: ComponentFixture<AppMetricsMonitoringComponent>;
    let service: AppMetricsService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [StreamerTestModule],
        declarations: [AppMetricsMonitoringComponent]
      })
        .overrideTemplate(AppMetricsMonitoringComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AppMetricsMonitoringComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AppMetricsService);
    });

    describe('refresh', () => {
      it('should call refresh on init', () => {
        // GIVEN
        const response = {
          timers: {
            service: 'test',
            unrelatedKey: 'test'
          },
          gauges: {
            'jcache.statistics': {
              value: 2
            },
            unrelatedKey: 'test'
          }
        };
        spyOn(service, 'getMetrics').and.returnValue(of(response));

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(service.getMetrics).toHaveBeenCalled();
      });
    });
  });
});
