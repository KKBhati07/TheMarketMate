import {ChangeDetectionStrategy, Component, Input} from "@angular/core";

@Component({
    selector: 'mm-nav-button',
    templateUrl: './app-nav-button.component.html',
    styleUrls: ['./app-nav-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppNavButtonComponent {
    @Input() isMobile = false;
    @Input() headerNav = false;
    @Input() isOpenAccountBtn = false;
    @Input() isLogoutBtn = false;
    @Input() class = '';
    @Input() text = '';
    @Input() gap = '';
    @Input() icon = '';
    @Input() showIcon = false;
    @Input() iconClass = '';
    @Input() iconContainerClass = '';
    @Input() active = false;
    @Input() textClass = '';
    @Input() onMobileWidth = '';


}
