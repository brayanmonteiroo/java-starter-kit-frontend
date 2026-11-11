import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthPageLayoutComponent } from '../../../layout/shell/auth-page-layout/auth-page-layout.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/api/auth.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  imports: [AuthPageLayoutComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styles: ``,
})
export class SignInComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = 'admin@java-starter.test';
  password = 'password';
  showPassword = false;
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    this.loading.set(true);
    this.error.set(null);
    this.auth
      .login(this.email, this.password)
      .pipe(switchMap(() => this.auth.loadMe()))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Credenciais inválidas');
        },
      });
  }
}
