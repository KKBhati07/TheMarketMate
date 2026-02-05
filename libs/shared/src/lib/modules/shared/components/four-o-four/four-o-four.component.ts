import { Component } from "@angular/core";
import { CONSTANTS } from "../../../../app.constants";
import { SHARED_UI_DEPS } from '../../../../constants/shared-imports';

@Component({
	selector: 'mm-fourofour',
	templateUrl: './four-o-four.component.html',
	standalone: true,
	imports: [...SHARED_UI_DEPS]
})
export class FourOFourComponent {

	protected readonly CONSTANTS = CONSTANTS;
}
