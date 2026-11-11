import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/shell/app-layout/app-layout.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './pages/auth-pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth-pages/reset-password/reset-password.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { UsersPageComponent } from './pages/admin/users/users-page.component';
import { RolesPageComponent } from './pages/admin/roles/roles-page.component';
import { AuditsPageComponent } from './pages/admin/audits/audits-page.component';
import { MyProfilePageComponent } from './pages/admin/profile/my-profile-page.component';
import { authGuard } from './core/api/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
        pathMatch: 'full',
        title: 'Painel | Java Starter Kit',
      },
      {
        path: 'users',
        component: UsersPageComponent,
        title: 'Usuários | Java Starter Kit',
      },
      {
        path: 'perfis',
        component: RolesPageComponent,
        title: 'Perfis | Java Starter Kit',
      },
      {
        path: 'audits',
        component: AuditsPageComponent,
        title: 'Auditoria | Java Starter Kit',
      },
      {
        path: 'meu-perfil',
        component: MyProfilePageComponent,
        title: 'Meu perfil | Java Starter Kit',
      },
    ],
  },
  {
    path: 'signin',
    component: SignInComponent,
    title: 'Login | Java Starter Kit',
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    title: 'Esqueci a senha | Java Starter Kit',
  },
  {
    path: 'auth/reset-password',
    component: ResetPasswordComponent,
    title: 'Redefinir senha | Java Starter Kit',
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Não encontrado | Java Starter Kit',
  },
];
