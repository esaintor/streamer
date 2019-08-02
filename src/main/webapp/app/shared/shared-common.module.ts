import { NgModule } from '@angular/core';

import { StreamerSharedLibsModule, AppAlertComponent, AppAlertErrorComponent } from './';

@NgModule({
  imports: [StreamerSharedLibsModule],
  declarations: [AppAlertComponent, AppAlertErrorComponent],
  exports: [StreamerSharedLibsModule, AppAlertComponent, AppAlertErrorComponent]
})
export class StreamerSharedCommonModule {}
