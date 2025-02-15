import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {ApiResponse} from "../models/api-response.model";
import {ApiHttpResponse} from "../app-util/api-response.util";
import {URLS} from "../urls";

@Injectable({
  providedIn: "root",
})

export class UserService {
  constructor(private apiService: ApiService) {
  }

  getDetails(uuid: string): Observable<ApiHttpResponse<ApiResponse>> {
    return this.apiService.get(URLS.API.V1.USER.USER_DETAILS(uuid))
  }

  getAllUsers(): Observable<ApiHttpResponse<ApiResponse>> {
    return this.apiService.get(URLS.API.V1.ADMIN.USERS.GET_ALL)
  }

  deleteUser(uuid: string): Observable<ApiHttpResponse<ApiResponse>> {
    return this.apiService.delete(URLS.API.V1.ADMIN.USERS.DELETE(uuid))
  }

  restoreUser(uuid: string): Observable<ApiHttpResponse<ApiResponse>> {
    return this.apiService.patch(URLS.API.V1.ADMIN.USERS.RESTORE(uuid), {restore: true})
  }
}
