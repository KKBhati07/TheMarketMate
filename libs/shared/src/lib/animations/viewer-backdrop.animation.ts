import { animate, state, style as animStyle, transition, trigger } from "@angular/animations";

export const viewerBackdropAnimation = trigger('viewerBackdrop', [
	state('open', animStyle({ opacity: 1 })),
	state('close', animStyle({ opacity: 0 })),
	transition('void => open', [
		animStyle({ opacity: 0 }),
		animate('180ms ease-out')
	]),
	transition('open => close', [
		animate('160ms ease-in', animStyle({ opacity: 0 }))
	]),
]);
export const viewerContentAnimation = trigger('viewerContent', [
	state('open', animStyle({ transform: 'translateY(0) scale(1)', opacity: 1 })),
	state('close', animStyle({ transform: 'translateY(10px) scale(0.98)', opacity: 0 })),
	transition('void => open', [
		animStyle({ transform: 'translateY(14px) scale(0.96)', opacity: 0 }),
		animate('220ms cubic-bezier(0.2, 0.8, 0.2, 1)')
	]),
	transition('open => close', [
		animate('160ms ease-in')
	]),
]);