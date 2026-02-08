/**
 * Utility functions for keyboard accessibility.
 * Provides handlers for Enter and Space key activation.
 */

export function handleKeyboardActivation(callback: () => void, event: KeyboardEvent): void {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		callback();
	}
}

export function shouldBeFocusable(element: HTMLElement): boolean {
	const role = element.getAttribute('role');
	const tabindex = element.getAttribute('tabindex');

	if (tabindex !== null) return true;

	if (role === 'button' || role === 'link') return true;
	
	// Has click
	if (element.onclick !== null) return true;
	
	return false;
}
