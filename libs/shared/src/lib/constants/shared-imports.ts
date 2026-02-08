import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

/**
 * Shared UI dependencies array for standalone components.
 * Contains commonly used Angular modules that are frequently needed
 * across standalone components in the shared library.
 */
export const SHARED_UI_DEPS = [
	CommonModule,
	MatIconModule,
	MatTooltipModule,
	RouterModule
] as const;
