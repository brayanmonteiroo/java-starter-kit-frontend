import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeToggleButtonComponent } from '../../../shared/components/common/theme-toggle/theme-toggle-button.component';
// import { NotificationDropdownComponent } from '../../header/notification-dropdown/notification-dropdown.component';
import { UserDropdownComponent } from '../../header/user-dropdown/user-dropdown.component';
import { SidebarService } from '../../../core/services/sidebar.service';

import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
// import { InputDirective } from '../../../shared/components/ui/input/input.directive';

@Component({
  selector: 'app-header',
  imports: [
    ButtonComponent,
    CommonModule,
    RouterModule,
    ThemeToggleButtonComponent,
    // NotificationDropdownComponent,
    UserDropdownComponent,
  ],
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  isApplicationMenuOpen = false;
  readonly isMobileOpen$;

  constructor(public sidebarService: SidebarService) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
  }

  handleToggle() {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen = !this.isApplicationMenuOpen;
  }
}
