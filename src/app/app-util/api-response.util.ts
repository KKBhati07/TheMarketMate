import {map, of, catchError, Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";

export interface ApiHttpResponse<T> extends HttpResponse<T> {
  isSuccessful(): boolean;
}

export function apiResponse<T>(response$: Observable<HttpResponse<T>>): Observable<ApiHttpResponse<T>> {
  return response$.pipe(
    map((response: HttpResponse<T>) => ({
      ...response.clone(),
      isSuccessful: () => response.status >= 200 && response.status < 300
    }) as ApiHttpResponse<T>),
    catchError((error) => {
      const errorResponse: ApiHttpResponse<T> = {
        ...error,
        status: error.status || 500,
        statusText: error.statusText || "Unknown Error",
        isSuccessful: () => false,
      } as ApiHttpResponse<T>;

      return of(errorResponse);
    })
  );
}
