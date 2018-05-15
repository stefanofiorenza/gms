import { inject, TestBed } from '@angular/core/testing';

import { LoginGuard } from './login.guard';
import { SessionService } from '../session/session.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginGuard', () => {

  const sessionServiceStub = { isLoggedIn: function () { return true; } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ LoginGuard, HttpClientTestingModule, { provide: SessionService, useValue: sessionServiceStub } ]
    });
  });

  it('should be created', inject([LoginGuard], (service: LoginGuard) => {
    expect(service).toBeTruthy();
  }));

  it('canActivateChild should return `false` if the user is logged in', () => {
    const guard = TestBed.get(LoginGuard);
    expect(guard.canActivateChild()).toBeFalsy();
  });

  it('canActivateChild should return `true` if the user is not logged in', () => {
    sessionServiceStub.isLoggedIn = function() { return false; };
    const guard = TestBed.get(LoginGuard);
    expect(guard.canActivateChild()).toBeTruthy();
  });
});
