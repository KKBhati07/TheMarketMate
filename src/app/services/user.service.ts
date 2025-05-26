import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {ApiResponse} from "../models/api-response.model";
import {ApiHttpResponse} from "../app-util/api-response.util";
import {AppUrls} from "../app.urls";

@Injectable({
  providedIn: "root",
})

export class UserService {
  constructor(private apiService: ApiService) {
  }

  getDetails(uuid: string): Observable<ApiHttpResponse<ApiResponse>> {
    return this.apiService.get(AppUrls.API.V1.USER.USER_DETAILS(uuid))
  }

  updateUser(data: FormData): Observable<ApiHttpResponse<ApiResponse>> {
    return this.apiService.put(AppUrls.API.V1.USER.UPDATE_USER, data)
  }

  updateUserByAdmin(data: FormData): Observable<ApiHttpResponse<ApiResponse>> {
    return this.apiService.put(AppUrls.API.V1.ADMIN.USERS.UPDATE, data)
  }

  getAllUsers(): Observable<ApiHttpResponse<ApiResponse>> {
    return this.apiService.get(AppUrls.API.V1.ADMIN.USERS.GET_ALL)
  }

  deleteUserByAdmin(uuid: string): Observable<ApiHttpResponse<ApiResponse>> {
    return this.apiService.delete(AppUrls.API.V1.ADMIN.USERS.DELETE(uuid))
  }

  deleteUser(uuid: string): Observable<ApiHttpResponse<ApiResponse>> {
    return this.apiService.delete(AppUrls.API.V1.USER.DELETE(uuid))
  }

  restoreUser(uuid: string): Observable<ApiHttpResponse<ApiResponse>> {
    return this.apiService.patch(AppUrls.API.V1.ADMIN.USERS.RESTORE(uuid), {restore: true})
  }
}
