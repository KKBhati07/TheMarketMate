import { Provider } from '@angular/core';
import { SHARED_LIB_CONFIG, SharedLibConfig } from '../../utils/tokens.util';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { FavoriteService } from '../../services/favorite.service';

/**
 * Provides core services with app-specific config.
 * Must be called in app.config.ts to configure ApiService, AuthService, etc.
 */
export function provideSharedLib(config: SharedLibConfig): Provider[] {
	return [
		ApiService,
		AuthService,
		StorageService,
		FavoriteService,
		{ provide: SHARED_LIB_CONFIG, useValue: config }
	];
}
