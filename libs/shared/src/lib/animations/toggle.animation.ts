import { trigger, transition, style, animate, AnimationTriggerMetadata, state } from '@angular/animations';

export const toggleAnimation: AnimationTriggerMetadata = trigger('toggleAnimation', [
	state('unchecked', style({ transform: 'translateX(0)' })),
	state('checked', style({ transform: 'translateX(24px)' })),
	transition('unchecked => checked', [
		animate('200ms ease-in-out')
	]),
	transition('checked => unchecked', [
		animate('200ms ease-in-out')
	])
]);
