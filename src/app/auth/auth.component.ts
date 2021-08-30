import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "./auth.service";

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
  constructor(private authService: AuthService) {}

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
    } else {
      this.authService
        .signup(
          this.authForm.get("email").value,
          this.authForm.get("password").value
        )
        .subscribe(
          (respData) => {
            console.log(respData);
            this.isLoading = false;
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
          }
        );
    }

    this.authForm.reset();
  }
}
