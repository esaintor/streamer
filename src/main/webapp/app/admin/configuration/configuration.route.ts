import { Route } from '@angular/router';

import { AppConfigurationComponent } from './configuration.component';

export const configurationRoute: Route = {
  path: 'app-configuration',
  component: AppConfigurationComponent,
  data: {
    pageTitle: 'Configuration'
  }
};
