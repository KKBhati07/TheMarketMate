import { Component, OnInit } from "@angular/core";
import { DeviceDetectorService, SHARED_UI_DEPS } from '@marketmate/shared';

@Component({
	selector: "mm-root",
	templateUrl: "./app-root.component.html",
	styleUrls: ["./app-root.component.scss"],
	standalone: true,
	imports: [...SHARED_UI_DEPS]
})
export class AppRootComponent implements OnInit {
	isMobile: boolean = false;

	constructor(private deviceDetectorService: DeviceDetectorService) {
	}


	ngOnInit(): void {
		this.setIsMobile();
	}

	setIsMobile() {
		this.deviceDetectorService.isMobile().subscribe((isMobile) => {
			this.isMobile = isMobile;
		});
	}
}
