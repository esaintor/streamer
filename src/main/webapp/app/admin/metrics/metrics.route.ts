import { Route } from '@angular/router';

import { AppMetricsMonitoringComponent } from './metrics.component';

export const metricsRoute: Route = {
  path: 'app-metrics',
  component: AppMetricsMonitoringComponent,
  data: {
    pageTitle: 'Application Metrics'
  }
};
