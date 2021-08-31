import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private logoutTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBnmsPaMN-_UUafdsLunsPg2lJF75kNaT8",
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((respData) => {
          this.handleAuthentication(respData);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBnmsPaMN-_UUafdsLunsPg2lJF75kNaT8",
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((respData) => {
          this.handleAuthentication(respData);
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(["/auth"]);
    localStorage.removeItem("userData");
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
    this.logoutTimer = null;
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _expiresInDatePretty: string;
    } = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._expiresInDatePretty)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      this.autoLogout(
        new Date(userData._expiresInDatePretty).getTime() * 1000 -
          new Date().getTime()
      );
    }
  }

  autoLogout(expirationTimeout: number) {
    return (this.logoutTimer = setTimeout(() => {
      this.logout();
    }, expirationTimeout));
  }

  private handleAuthentication(respData) {
    const expiresInDatePretty = new Date(
      new Date().getTime() + +respData.expiresIn * 1000
    );
    const user = new User(
      respData.email,
      respData.localId,
      respData.idToken,
      expiresInDatePretty
    );
    localStorage.setItem("userData", JSON.stringify(user));
    this.user.next(user);
    this.autoLogout(respData.expiresIn * 1000);
  }

  private handleError(respData: HttpErrorResponse) {
    console.log(respData);
    let errorMessage: string = "Something went wrong";
    if (respData.error || respData.error.error) {
      errorMessage = respData.error.error.message;
      return throwError(errorMessage);
    }
    return throwError(errorMessage);
  }
}
