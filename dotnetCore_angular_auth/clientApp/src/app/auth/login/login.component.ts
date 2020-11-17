import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public isLoading = false;
  public errorMessage: string;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      UserName: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigateByUrl('/guarded-component/logged-in-user');

        this.cd.markForCheck();
      },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse)
        this.errorMessage = errorResponse.error?.description;
        this.isLoading = false;
        this.cd.markForCheck();
      }
    );
  }
}
