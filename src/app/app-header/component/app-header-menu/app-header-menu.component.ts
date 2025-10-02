import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {NavOption} from '../../../models/nav-options.model';
import { fadeInOut } from '../../../app-util/animations/fade-in-out.animation';

@Component({
  selector: 'app-header-menu',
  templateUrl: './app-header-menu.component.html',
  styleUrls: ['./app-header-menu.component.scss'],
  animations: [fadeInOut],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderMenuComponent {
  @Input() isAuthenticated: boolean = false;
  @Input() isAdmin: boolean = false;

  @Output() onItemClick: EventEmitter<NavOption | null>
      = new EventEmitter<NavOption | null>();

  @Output() closeMenu: EventEmitter<void>
      = new EventEmitter<void>();

  constructor() {}
}