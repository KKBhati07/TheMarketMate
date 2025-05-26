import {map, of, catchError, Observable} from "rxjs";
import {HttpErrorResponse, HttpEventType, HttpResponse} from "@angular/common/http";

export interface ApiHttpResponse<T> extends HttpResponse<T> {
  isSuccessful(): boolean;
}

export function apiResponse<T>(response$: Observable<HttpResponse<T>>): Observable<ApiHttpResponse<T>> {
  return response$.pipe(
    map((response: HttpResponse<T>) => ({
      ...response.clone(),
      isSuccessful: () => response.status >= 200 && response.status < 300
    }) as ApiHttpResponse<T>),
    catchError((error: HttpErrorResponse) => {
        const errorResponse: ApiHttpResponse<T> = {
            body: null as any,
            headers: error.headers,
            status: error.status || 500,
            statusText: error.statusText || "Unknown Error",
            url: error.url || null,
            ok: false,
            type: HttpEventType.Response,
            clone: () => error as any,
            isSuccessful: () => false
        };

      return of(errorResponse);
    })
  );
}
