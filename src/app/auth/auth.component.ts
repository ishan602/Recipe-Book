import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Route, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService, AuthResponseData } from "./auth.service";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent implements OnInit {
  loginMode: boolean = false;
  authForm: FormGroup;
  isLoading: boolean = false;
  isError: boolean = false;
  error: string = null;
  loginObs: Observable<AuthResponseData>;
  constructor(private authService: AuthService, private route: Router) {}

  ngOnInit(): void {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit() {
    console.log(this.authForm.value);
    this.isLoading = true;
    if (this.loginMode) {
      this.loginObs = this.authService.login(
        this.authForm.get("email").value,
        this.authForm.get("password").value
      );
    } else {
      this.loginObs = this.authService.signup(
        this.authForm.get("email").value,
        this.authForm.get("password").value
      );
    }

    this.loginObs.subscribe(
      (respData) => {
        console.log(respData);
        this.isLoading = false;
        this.route.navigate(["/recipes"]);
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
        this.isError = true;
      }
    );

    this.authForm.reset();
  }

  handleClose() {
    this.isError = false;
    this.isLoading = false;
  }
}
