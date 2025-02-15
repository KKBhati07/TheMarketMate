import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {ApiHttpResponse} from "../app-util/api-response.util";
import {ApiResponse} from "../models/api-response.model";
import {URLS} from "../urls";
import {shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
  })
export class CategoryService {
  constructor(private apiService: ApiService) {}
  private categories$: Observable<ApiHttpResponse<ApiResponse>> | null = null;

  getCategories() :Observable<ApiHttpResponse<ApiResponse>>{
    if(this.categories$) return this.categories$;
    this.categories$ = this.apiService.get<ApiResponse>(URLS.API.V1.CATEGORY.GET_ALL).pipe(shareReplay(1));
    return this.categories$;
  }
}
