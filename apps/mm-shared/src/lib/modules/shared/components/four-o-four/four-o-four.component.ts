import { Component } from "@angular/core";
import { CONSTANTS } from "../../../../app.constants";

/**
 * 404 Not Found page component.
 * 
 * Displays when a user navigates to a route that doesn't exist.
 * Typically used as a catch-all route fallback.
 */
@Component({
	selector: 'mm-fourofour',
	templateUrl: './four-o-four.component.html',
})
export class FourOFourComponent {

	protected readonly CONSTANTS = CONSTANTS;
}
