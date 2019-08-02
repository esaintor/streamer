import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StreamerSharedModule } from 'app/shared';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

import {
  adminState,
  LogsComponent,
  AppMetricsMonitoringComponent,
  AppHealthModalComponent,
  AppHealthCheckComponent,
  AppConfigurationComponent,
  AppDocsComponent
} from './';

@NgModule({
  imports: [
    StreamerSharedModule,
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild(adminState)
  ],
  declarations: [
    LogsComponent,
    AppConfigurationComponent,
    AppHealthCheckComponent,
    AppHealthModalComponent,
    AppDocsComponent,
    AppMetricsMonitoringComponent
  ],
  entryComponents: [AppHealthModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StreamerAdminModule {}
