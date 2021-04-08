import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { ApiListResult } from '../models/api-list-result.type';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseApi = '/api/v1';

  constructor(private readonly httpClient: HttpClient) {}

  public getUsersList(
    sort: string,
    order: string,
    page: number,
    limit: number
  ): Observable<ApiListResult<User[]>> {
    const requestUrl = `${this.baseApi}/user?sort=${sort}&order=${order}&skip=${
      limit * page
    }&limit=${limit}`;

    return this.httpClient.get<ApiListResult<User[]>>(requestUrl);
  }

  public addUser(user: User) {
    return this.httpClient.post<User>(`${this.baseApi}/user`, user);
  }

  public updateUser(user: User) {
    return this.httpClient.put<User>(`${this.baseApi}/user/${user._id}`, user);
  }
}
