import { Route } from '@angular/router';

import { AppHealthCheckComponent } from './health.component';

export const healthRoute: Route = {
  path: 'app-health',
  component: AppHealthCheckComponent,
  data: {
    pageTitle: 'Health Checks'
  }
};
