import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: "mm-back-fw-icon",
	templateUrl: "./back-forward-icon.component.html",
	styleUrls: ["./back-forward-icon.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackForwardIconComponent {

	@Input() isForwardIcon = false;
	@Input() containerClass: string = '';
	@Input() iconClass: string = '';
	@Input() backgroundColor: string = '';
	@Input() iconColor: string = 'white';

}