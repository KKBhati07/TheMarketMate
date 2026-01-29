import { InjectionToken } from '@angular/core';

/**
 * Configuration interface for the shared library.
 * 
 * Contains application-specific settings required by shared services.
 */
export interface SharedLibConfig { 
	/** Base URL for API requests */
	apiUrl: string; 
}

/**
 * Injection token for providing SharedLibConfig.
 * 
 * Used to inject the shared library configuration into services.
 */
export const SHARED_LIB_CONFIG = new InjectionToken<SharedLibConfig>('SHARED_LIB_CONFIG');