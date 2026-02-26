import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from "./app-header/component/app-header.component";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatDialogModule } from "@angular/material/dialog";
import { AuthService } from '@marketmate/shared';
import { ChatSocketService } from './services/chat-socket.service';
import { ChatRealtimeBridgeService } from './services/chat-realtime-bridge.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		AppHeaderComponent,
		MatDialogModule,
	],
	providers: [
		{ provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
		{ provide: MatBottomSheetRef, useValue: null }
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'marketmate';
	private readonly destroy$ = new Subject<void>();
	private startingRealtime = false;
	private realtimeStarted = false;

	constructor(
		private readonly authService: AuthService,
		private readonly router: Router,
		private readonly chatSocketService: ChatSocketService,
		private readonly chatRealtimeBridge: ChatRealtimeBridgeService,
		@Inject(PLATFORM_ID) private readonly platformId: Object
	) {}

	ngOnInit() {
		if (!isPlatformBrowser(this.platformId)) return;
		this.tryStartRealtimeBridge();
		this.router.events
			.pipe(
				filter((event): event is NavigationEnd => event instanceof NavigationEnd),
				takeUntil(this.destroy$)
			)
			.subscribe(() => {
				this.tryStartRealtimeBridge();
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private tryStartRealtimeBridge() {
		if (this.realtimeStarted || this.startingRealtime) return;
		if (!this.authService.Authenticated) return;

		this.startingRealtime = true;
		this.chatSocketService.connect()
			.then(() => {
				this.chatRealtimeBridge.start();
				this.realtimeStarted = true;
			})
			.catch((error) => {
				console.warn('Failed to connect chat socket on app init:', error);
			})
			.finally(() => {
				this.startingRealtime = false;
			});
	}
}

