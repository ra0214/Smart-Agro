import { Component, Inject, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LOGIN_REPOSITORY, LoginRepository } from './data/login.repository';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  submitted = false;
  error: string | null = null;
  loading = false;

  private sub: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    @Inject(LOGIN_REPOSITORY)
    private readonly authRepo: LoginRepository
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    if (this.loginForm.invalid) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.value;

    this.sub = this.authRepo.authenticate(credentials).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          this.authService.login(response.user);
          this.router.navigate(['/home']);
        } else {
          this.error = response.error || 'Error de autenticación';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al conectar con el servidor';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
