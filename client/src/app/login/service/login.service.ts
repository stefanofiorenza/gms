import { Injectable } from '@angular/core';
import { LoginRequestModel } from '../../core/session/login-request.model';
import { Observable } from 'rxjs/index';
import { tap } from 'rxjs/operators';
import { LoginResponseModel } from '../../core/session/login-response.model';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../core/session/session.service';
import { SessionUserService } from '../../core/session/session-user.service';
import { api } from '../../../environments/environment';

/**
 * A service for providing handling the login/logout processes.
 */
@Injectable()
export class LoginService {

  /**
   * API base url.
   */
  private url: string;

  /**
   * Service constructor.
   * @param http HttpClient dependency injection.
   * @param sessionService SessionService for storing/retrieving session-related information.
   * @param sessionUserService SessionUserService for storing/retrieving session user-related information.
   */
  constructor(private http: HttpClient, private sessionService: SessionService, private sessionUserService: SessionUserService) {
    this.url = api.baseUrl;
  }

  /**
   * Performs a login request.
   * @param {LoginResponseModel} payload Login data to be sent to the service in order to get the authorization data.
   * @returns {Observable<LoginResponseModel>}
   */
  login(payload: LoginRequestModel): Observable<LoginResponseModel> {
    return this.http.post<LoginResponseModel>(this.url + 'login', payload).pipe(
      tap((response) => {
        if (response.access_token) {
          this.sessionService.setLoggedIn(true);
          this.sessionService.setAuthData(response);
          console.log(response);

          this.sessionUserService.getCurrentUser(response.username).subscribe(userPgData => {
            this.sessionService.setUser(userPgData._embedded.user[0]);
            console.log(this.sessionService.getUser());
          });
        }
      })
    );
  }
}
