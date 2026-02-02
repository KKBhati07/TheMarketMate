import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { IconPosition } from '../../../../types/common.type';


type Button = 'submit' | 'reset' | 'button';

@Component({
	selector: "mm-button",
	templateUrl: "./app-button.component.html",
	styleUrls: ["./app-button.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None

})
export class AppButtonComponent {
	@Input() type: Button | '' = '';
	@Input() disabled: boolean = false;
	@Input() text = '';
	@Input() textClass = '';
	@Input() icon = '';
	@Input() showIcon: boolean = false;
	@Input() isWarningBtn: boolean = false;
	@Input() position: IconPosition = 'LEFT';
	@Input() background = '';
	@Input() class = '';
	@Input() style = {};
	@Input() iconClass = '';
}
