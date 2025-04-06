import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _FormBuilder: FormBuilder
  ) {}

  errMsg: string = ''; // '' -===>false    |   'dsdsdf' ===>true
  isLoading: boolean = false;

  loginForm: FormGroup = this._FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9_@]{6,}$/)],
    ],
  });

  // loginForm: FormGroup = new FormGroup(
  //   {
  //
  //     email: new FormControl('', [Validators.required, Validators.email]),
  //     password: new FormControl('', [
  //       Validators.required,
  //       Validators.pattern(/^[a-zA-Z0-9_@]{6,}$/),
  //     ]),

  //   }
  // );

  handleForm(): void {
    const userData = this.loginForm.value;
    this.isLoading = true;

    if (this.loginForm.valid === true) {
      this._AuthService.login(userData).subscribe({
        next: (response) => {
          //tmam

          if (response.message == 'success') {
            localStorage.setItem('etoken', response.token);

            this._AuthService.decodeUser();

            this.isLoading = false;
            this._Router.navigate(['/home']);
          }
        },
        error: (err) => {
          // msh tmam
          this.errMsg = err.error.message;
          this.isLoading = false;
        },
      });
    }
  }
}
