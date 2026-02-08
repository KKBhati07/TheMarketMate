import { Component } from "@angular/core";
import { SHARED_UI_DEPS } from '@marketmate/shared';

@Component({
	selector: "mm-root",
	templateUrl: "./app-root.component.html",
	styleUrls: ["./app-root.component.scss"],
	standalone: true,
	imports: [...SHARED_UI_DEPS]
})
export class AppRootComponent {
	isMobile: boolean = false;
}
