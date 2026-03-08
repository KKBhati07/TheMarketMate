import { InjectionToken } from '@angular/core';

export interface SharedLibConfig { 
	apiUrl: string;
	emailEnabled?: boolean;
}

export const SHARED_LIB_CONFIG = new InjectionToken<SharedLibConfig>('SHARED_LIB_CONFIG');