import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SessionService } from 'src/app/core/session/session.service';
import { User } from 'src/app/core/session/user.model';

/**
 * Service for providing configurations-related services.
 */
@Injectable()
export class ConfigurationService {

  /**
   * API base url.
   */
  private url = environment.apiBaseUrl + 'configuration';

  /**
   * Service's constructor
   * @param {HttpClient} http HttpClient for performing api requests.
   */
  constructor(private http: HttpClient, private readonly sessionService: SessionService) { }

  /**
   * Return an Observable of objects. Each object contains all system-wide available configurations.
   * The configurations are in the shape o {configKey: configValue}.
   */
  getConfigurations(): Observable<object> {
    return this.http.get<object>(this.url);
  }

  /**
   * Return an Observable of objects. Each object contains the user available configurations.
   * The configurations are in the shape o {configKey: configValue}.
   */
  getUserConfigurations(): Observable<object> {
    return this.sessionService.getUser().pipe(
      switchMap((user: User) => this.http.get<object>(`${this.url}/${user.id}`))
    );
  }
}
