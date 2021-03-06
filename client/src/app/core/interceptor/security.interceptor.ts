import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';

import { SessionService } from '../session/session.service';

/**
 * Interceptor for setting on every request made the authorization header if the user has being logged in previously.
 */
@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  /**
   * Session service for retrieving session-related info in order to modify requests regarding to security parameters.
   */
  private sessionService: SessionService;

  /**
   * Indicates whether the user is logged in or not.
   */
  private isLoggedIn = false;

  /**
   * Holds the authentication header.
   */
  private header = '';

  /**
   * Holds the token type.
   */
  private tokenType = '';

  /**
   * Holds the access token.
   */
  private accessToken = '';

  /**
   * Interceptor constructor.
   * @param injector Angular injector for retrieving the service dependencies properly.
   */
  constructor(private injector: Injector) {
    this.sessionService = this.injector.get(SessionService);
    this.sessionService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
    this.sessionService.getHeader().subscribe((header: string) => {
      this.header = header;
    });
    this.sessionService.getTokenType().subscribe((tokenType: string) => {
      this.tokenType = tokenType;
    });
    this.sessionService.getAccessToken().subscribe((accessToken: string) => {
      this.accessToken = accessToken;
    });
  }

  /**
   * Intercepts all request in order to set the Authorization header properly if the user is logged in.
   *
   * @param req Request performed.
   * @param next Next http handler.
   * @returns Observable<HttpEvent<any>>
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!!this.isLoggedIn && !!this.header && !!this.tokenType && !!this.accessToken) {
      // logged in and all necessary data is here already
      const iHeaders: { [key: string]: any } = {};
      iHeaders[this.header] = this.tokenType + ' ' + this.accessToken;
      return next.handle(req.clone({ setHeaders: iHeaders }));
    } else {
      return next.handle(req);
    }
  }
}
