import {
	trigger,
	style,
	transition,
	animate,
} from '@angular/animations';

export const toastAnimation = trigger('toastAnimation', [
	transition(':enter', [
		style({
			opacity: 0,
			transform: 'translateX(24px)',
		}),
		animate(
				'200ms ease-out',
				style({
					opacity: 1,
					transform: 'translateX(0)',
				})
		),
	]),

	transition(':leave', [
		animate(
				'150ms ease-in',
				style({
					opacity: 0,
					transform: 'translateX(24px)',
				})
		),
	]),
]);
