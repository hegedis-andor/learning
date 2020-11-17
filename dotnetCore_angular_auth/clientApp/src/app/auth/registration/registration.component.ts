import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


const passwordsDoNotMatchValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  const password = formGroup.get('Password').value;
  const confirmPassword = formGroup.get('ConfirmPassword').value;

  return password !== confirmPassword ? { passwordsDoNotMatch: true } : null;
};


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidParent = !!(
      control
      && control.parent
      && control.parent.hasError('passwordsDoNotMatch')
    );
    return (invalidParent);
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent implements OnInit {
  public registrationForm: FormGroup;
  public isLoading = false;
  public errorMessage: string;
  errorStateMatcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder, public authService: AuthService, private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [ Validators.required, Validators.minLength(6)] ],
      ConfirmPassword: ['', Validators.required],
    }, { validators: passwordsDoNotMatchValidator });
  }

  public register(): void {
    if (this.registrationForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.register(this.registrationForm.value).subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigateByUrl('/guarded-component/logged-in-user');

        this.cd.markForCheck();
      },
      (errorResponse: HttpErrorResponse) => {
        this.errorMessage = errorResponse.error;
        this.isLoading = false;
        this.cd.markForCheck();
      }
    );
  }

}
