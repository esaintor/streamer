import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StreamerSharedLibsModule, StreamerSharedCommonModule, AppLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [StreamerSharedLibsModule, StreamerSharedCommonModule],
  declarations: [AppLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [AppLoginModalComponent],
  exports: [StreamerSharedCommonModule, AppLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StreamerSharedModule {
  static forRoot() {
    return {
      ngModule: StreamerSharedModule
    };
  }
}
