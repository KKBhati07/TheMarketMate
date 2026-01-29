import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { IconPosition } from '../../../../types/common.type';


type Button = 'submit' | 'reset' | 'button';

/**
 * Reusable button component with icon support and customizable styling.
 * 
 * Supports various button types, icon positioning, and custom CSS classes.
 * Uses OnPush change detection for optimal performance.
 */
@Component({
	selector: "mm-button",
	templateUrl: "./app-button.component.html",
	styleUrls: ["./app-button.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None

})
export class AppButtonComponent implements OnInit {
	/** Button type: 'submit', 'reset', or 'button' */
	@Input() type: Button | '' = '';
	
	/** Whether the button is disabled */
	@Input() disabled: boolean = false;
	
	/** Button text label */
	@Input() text = '';
	
	/** CSS classes to apply to the text element */
	@Input() textClass = '';
	
	/** Material icon name to display */
	@Input() icon = '';
	
	/** Whether to show the icon */
	@Input() showIcon: boolean = false;
	
	/** Whether this is a warning/danger button (different styling) */
	@Input() isWarningBtn: boolean = false;
	
	/** Icon position relative to text: 'LEFT' or 'RIGHT' */
	@Input() position: IconPosition = 'LEFT';
	
	/** Custom background color */
	@Input() background = '';
	
	/** Additional CSS classes for the button element */
	@Input() class = '';
	
	/** Inline styles object */
	@Input() style = {};
	
	/** CSS classes for the icon element */
	@Input() iconClass = '';

	ngOnInit() {
	}
}
