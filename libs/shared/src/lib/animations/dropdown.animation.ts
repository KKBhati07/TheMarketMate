import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export const dropdownAnimation: AnimationTriggerMetadata = trigger('dropdownAnimation', [
	transition(':enter', [
		style({
			opacity: 0,
			transform: 'scale(0.95) translateY(-6px)'
		}),
		animate(
				'150ms ease-out',
				style({
					opacity: 1,
					transform: 'scale(1) translateY(0)'
				})
		)
	]),
	transition(':leave', [
		animate(
				'100ms ease-in',
				style({
					opacity: 0,
					transform: 'scale(0.98) translateY(-4px)'
				})
		)
	])
])