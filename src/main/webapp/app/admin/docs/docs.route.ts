import { Route } from '@angular/router';

import { AppDocsComponent } from './docs.component';

export const docsRoute: Route = {
  path: 'docs',
  component: AppDocsComponent,
  data: {
    pageTitle: 'API'
  }
};
