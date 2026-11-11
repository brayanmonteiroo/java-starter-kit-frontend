import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { SafeHtmlPipe } from '../../../shared/pipe/safe-html.pipe';
import { SidebarService } from '../../../core/services/sidebar.service';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  new?: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

@Component({
  selector: 'app-sidebar',
  imports: [ButtonComponent, CommonModule, RouterModule, SafeHtmlPipe],
  templateUrl: './app-sidebar.component.html',
})
export class AppSidebarComponent {

  // Menu — visão geral
  navItems: NavItem[] = [
    {
      // Painel (grid)
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 3.25C4.25736 3.25 3.25 4.25736 3.25 5.5V8.99998C3.25 10.2426 4.25736 11.25 5.5 11.25H9C10.2426 11.25 11.25 10.2426 11.25 8.99998V5.5C11.25 4.25736 10.2426 3.25 9 3.25H5.5ZM4.75 5.5C4.75 5.08579 5.08579 4.75 5.5 4.75H9C9.41421 4.75 9.75 5.08579 9.75 5.5V8.99998C9.75 9.41419 9.41421 9.74998 9 9.74998H5.5C5.08579 9.74998 4.75 9.41419 4.75 8.99998V5.5ZM5.5 12.75C4.25736 12.75 3.25 13.7574 3.25 15V18.5C3.25 19.7426 4.25736 20.75 5.5 20.75H9C10.2426 20.75 11.25 19.7427 11.25 18.5V15C11.25 13.7574 10.2426 12.75 9 12.75H5.5ZM4.75 15C4.75 14.5858 5.08579 14.25 5.5 14.25H9C9.41421 14.25 9.75 14.5858 9.75 15V18.5C9.75 18.9142 9.41421 19.25 9 19.25H5.5C5.08579 19.25 4.75 18.9142 4.75 18.5V15ZM12.75 5.5C12.75 4.25736 13.7574 3.25 15 3.25H18.5C19.7426 3.25 20.75 4.25736 20.75 5.5V8.99998C20.75 10.2426 19.7426 11.25 18.5 11.25H15C13.7574 11.25 12.75 10.2426 12.75 8.99998V5.5ZM15 4.75C14.5858 4.75 14.25 5.08579 14.25 5.5V8.99998C14.25 9.41419 14.5858 9.74998 15 9.74998H18.5C18.9142 9.74998 19.25 9.41419 19.25 8.99998V5.5C19.25 5.08579 18.9142 4.75 18.5 4.75H15ZM15 12.75C13.7574 12.75 12.75 13.7574 12.75 15V18.5C12.75 19.7426 13.7574 20.75 15 20.75H18.5C19.7426 20.75 20.75 19.7427 20.75 18.5V15C20.75 13.7574 19.7426 12.75 18.5 12.75H15ZM14.25 15C14.25 14.5858 14.5858 14.25 15 14.25H18.5C18.9142 14.25 19.25 14.5858 19.25 15V18.5C19.25 18.9142 18.9142 19.25 18.5 19.25H15C14.5858 19.25 14.25 18.9142 14.25 18.5V15Z" fill="currentColor"></path></svg>`,
      name: "Painel",
      path: "/",
    }
  ];

  // Administração
  othersItems: NavItem[] = [
    {
      // Usuários
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6174 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.942 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.942 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z" fill="currentColor"></path></svg>`,
      name: "Usuários",
      path: "/users",
    },
    {
      // Perfis (escudo)
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.9998 2.00195C11.7096 2.00195 11.4192 2.07483 11.1539 2.2207L4.15391 6.05371C3.60457 6.35562 3.24976 6.93974 3.24976 7.57324V12.709C3.24976 17.2294 6.20984 21.2108 10.4998 22.5703C11.4535 22.8724 12.5462 22.8724 13.4998 22.5703C17.7897 21.2108 20.7498 17.2294 20.7498 12.709V7.57324C20.7498 6.93974 20.3949 6.35562 19.8455 6.05371L12.8455 2.2207C12.5802 2.07483 12.2899 2.00195 11.9998 2.00195ZM5.24976 7.57324L11.9998 3.87305L18.7498 7.57324V12.709C18.7498 16.4221 16.3193 19.7044 12.7498 20.8359C12.2609 20.9909 11.7386 20.9909 11.2498 20.8359C7.68023 19.7044 5.24976 16.4221 5.24976 12.709V7.57324ZM15.5301 10.4697C15.823 10.7626 15.823 11.2374 15.5301 11.5303L11.5301 15.5303C11.2372 15.8232 10.7624 15.8232 10.4695 15.5303L8.46954 13.5303C8.17664 13.2374 8.17664 12.7626 8.46954 12.4697C8.76243 12.1768 9.2373 12.1768 9.5302 12.4697L10.9998 13.9393L14.4695 10.4697C14.7624 10.1768 15.2372 10.1768 15.5301 10.4697Z" fill="currentColor"></path></svg>`,
      name: "Perfis",
      path: "/perfis",
    },
    {
      // Auditoria
      icon: `<svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 3.5C5.50736 3.5 4.5 4.50736 4.5 5.75V18.25C4.5 19.4926 5.50736 20.5 6.75 20.5H17.25C18.4926 20.5 19.5 19.4926 19.5 18.25V9.66421C19.5 9.0665 19.2625 8.49307 18.8401 8.07068L14.9293 4.15991C14.5069 3.73752 13.9335 3.5 13.3358 3.5H6.75ZM3 5.75C3 3.67893 4.67893 2 6.75 2H13.3358C14.3312 2 15.2859 2.39539 16.0104 3.09886L19.9212 7.00964C20.6247 7.71311 21 8.66778 21 9.66317V18.25C21 20.3211 19.3211 22 17.25 22H6.75C4.67893 22 3 20.3211 3 18.25V5.75ZM8 12.25C8 11.8358 8.33579 11.5 8.75 11.5H15.25C15.6642 11.5 16 11.8358 16 12.25C16 12.6642 15.6642 13 15.25 13H8.75C8.33579 13 8 12.6642 8 12.25ZM8.75 14.5C8.33579 14.5 8 14.8358 8 15.25C8 15.6642 8.33579 16 8.75 16H12.25C12.6642 16 13 15.6642 13 15.25C13 14.8358 12.6642 14.5 12.25 14.5H8.75Z" fill="currentColor"></path></svg>`,
      name: "Auditoria",
      path: "/audits",
    },
  ];

  openSubmenu: string | null | number = null;
  subMenuHeights: { [key: string]: number } = {};
  @ViewChildren('subMenu') subMenuRefs!: QueryList<ElementRef>;

  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  private subscription: Subscription = new Subscription();

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.isHovered$ = this.sidebarService.isHovered$;
  }

  ngOnInit() {
    // Subscribe to router events
    this.subscription.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.setActiveMenuFromRoute(this.router.url);
        }
      })
    );

    // Subscribe to combined observables to close submenus when all are false
    this.subscription.add(
      combineLatest([this.isExpanded$, this.isMobileOpen$, this.isHovered$]).subscribe(
        ([isExpanded, isMobileOpen, isHovered]) => {
          if (!isExpanded && !isMobileOpen && !isHovered) {
            // this.openSubmenu = null;
            // this.savedSubMenuHeights = { ...this.subMenuHeights };
            // this.subMenuHeights = {};
            this.cdr.detectChanges();
          } else {
            // Restore saved heights when reopening
            // this.subMenuHeights = { ...this.savedSubMenuHeights };
            // this.cdr.detectChanges();
          }
        }
      )
    );

    // Initial load
    this.setActiveMenuFromRoute(this.router.url);
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  isActive(path: string): boolean {
    return (
      this.router.url === path ||
      (path === '/ai-settings' && this.router.url.startsWith('/ai-settings'))
    );
  }

  isItemActive(nav: NavItem, section: string, index: number): boolean {
    if (nav.subItems?.length) {
      return (
        this.openSubmenu === `${section}-${index}` ||
        nav.subItems.some((sub) => this.isActive(sub.path))
      );
    }
    return nav.path ? this.isActive(nav.path) : false;
  }

  toggleSubmenu(section: string, index: number) {
    const key = `${section}-${index}`;

    if (this.openSubmenu === key) {
      this.openSubmenu = null;
      this.subMenuHeights[key] = 0;
    } else {
      this.openSubmenu = key;

      setTimeout(() => {
        const el = document.getElementById(key);
        if (el) {
          this.subMenuHeights[key] = el.scrollHeight;
          this.cdr.detectChanges(); // Ensure UI updates
        }
      });
    }
  }

  onSidebarMouseEnter() {
    this.isExpanded$.subscribe(expanded => {
      if (!expanded) {
        this.sidebarService.setHovered(true);
      }
    }).unsubscribe();
  }

  private setActiveMenuFromRoute(currentUrl: string) {
    const menuGroups = [
      { items: this.navItems, prefix: 'main' },
      { items: this.othersItems, prefix: 'others' },
    ];

    menuGroups.forEach(group => {
      group.items.forEach((nav, i) => {
        if (nav.subItems) {
          nav.subItems.forEach(subItem => {
            if (
              currentUrl === subItem.path ||
              (subItem.path === '/ai-settings' && currentUrl.startsWith('/ai-settings'))
            ) {
              const key = `${group.prefix}-${i}`;
              this.openSubmenu = key;

              setTimeout(() => {
                const el = document.getElementById(key);
                if (el) {
                  this.subMenuHeights[key] = el.scrollHeight;
                  this.cdr.detectChanges(); // Ensure UI updates
                }
              });
            }
          });
        }
      });
    });
  }

  onSubmenuClick() {
    this.isMobileOpen$.subscribe(isMobile => {
      if (isMobile) {
        this.sidebarService.setMobileOpen(false);
      }
    }).unsubscribe();
  }  


  onSingleMenuClick() {
    // Close any open submenu
    this.openSubmenu = null;
    this.subMenuHeights = {};
  
    // Also close sidebar if mobile
    this.isMobileOpen$.subscribe(isMobile => {
      if (isMobile) {
        this.sidebarService.setMobileOpen(false);
      }
    }).unsubscribe();
  }
  
  
}
