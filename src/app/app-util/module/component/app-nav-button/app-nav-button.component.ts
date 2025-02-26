import {ChangeDetectionStrategy, Component, Input} from "@angular/core";

@Component({
    selector: 'mm-nav-button',
    templateUrl: './app-nav-button.component.html',
    styleUrls: ['./app-nav-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppNavButtonComponent {
    @Input() isMobile = false;
    @Input() class = '';
    @Input() dynamicClass = '';
    @Input() text = '';
    @Input() icon = '';
    @Input() showIcon = true;
    @Input() iconClass = '';
    @Input() active = false;
    @Input() textClass = '';
    @Input() onMobileWidth = '';


}
