import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from './session/session.service';
import { StorageService } from './storage/storage.service';
import { LoginGuard } from './guard/login.guard';
import { SessionUserService } from './session/session-user.service';
import { SecurityInterceptor } from './interceptor/security.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [],
  exports: [CommonModule, FormsModule]
})
export class GmsCoreModule {

  /**
   * Module's constructor.
   * @param {GmsCoreModule} parentModule Self GmsCoreModule injected into its own constructor in order to guard against a lazy-loaded module
   * re-importing this module.
   */
  constructor(@Optional() @SkipSelf() parentModule: GmsCoreModule) {
    if (parentModule) {
      throw new Error('GmsCoreModule is already loaded. Import it in the AppModule only');
    }
  }

  /**
   * Method for getting a module's instance with providers.
   * @param config Optional configuration object with custom providers to be used. The following attributes can be set in the object in
   * order to set custom providers:
   * <p>- `sessionService` for providing a SessionService instance</p>
   * <p>Example of configuration object: { sessionService: MySessionService } </p>
   */
  static forRoot(config?: any): ModuleWithProviders {
    return {
      ngModule: GmsCoreModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: SecurityInterceptor,
          multi: true
        },
        {
          provide: SessionService,
          useClass: config && config['sessionService'] ? config['sessionService'] : SessionService
        },
        {
          provide: StorageService,
          useClass: config && config['storageService'] ? config['storageService'] : StorageService
        },
        {
          provide: LoginGuard,
          useClass: config && config['loginGuard'] ? config['loginGuard'] : LoginGuard
        },
        {
          provide: SessionUserService,
          useClass: config && config['userService'] ? config['userService'] : SessionUserService
        }
      ]
    };
  }
}
