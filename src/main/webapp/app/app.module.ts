import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { NgJhipsterModule } from 'ng-jhipster';

import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { NotificationInterceptor } from './blocks/interceptor/notification.interceptor';
import { StreamerSharedModule } from 'app/shared';
import { StreamerCoreModule } from 'app/core';
import { StreamerAppRoutingModule } from './app-routing.module';
import { StreamerHomeModule } from './home/home.module';
import { StreamerEntityModule } from './entities/entity.module';
import * as moment from 'moment';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { AppMainComponent, NavbarComponent, FooterComponent, PageRibbonComponent, ErrorComponent } from './layouts';
import { StreamComponent } from 'app/stream/stream.component';

@NgModule({
  imports: [
    BrowserModule,
    NgxWebstorageModule.forRoot({ prefix: 'app', separator: '-' }),
    NgJhipsterModule.forRoot({
      // set below to true to make alerts look like toast
      alertAsToast: false,
      alertTimeout: 5000
    }),
    StreamerSharedModule.forRoot(),
    StreamerCoreModule,
    StreamerHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    StreamerEntityModule,
    StreamerAppRoutingModule
  ],
  declarations: [AppMainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent, StreamComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthExpiredInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppMainComponent]
})
export class StreamerAppModule {
  constructor(private dpConfig: NgbDatepickerConfig) {
    this.dpConfig.minDate = { year: moment().year() - 100, month: 1, day: 1 };
  }
}
