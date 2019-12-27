import { Component, OnInit } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

const BASE_URL = "https://angular-irc-starter-forkjoin.stackblitz.io";

@Component({
  selector: "sb-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "World";
  lookupStates: Array<LookupStateModel>;
  constructor(private stateService: StateService) {}
  ngOnInit() {
    this.getState();
  }
  getState() {
    this.stateService.getList().subscribe(response => {
      if (response.status === HTTP_STATUS_CODE.OK && response.data != null) {
        if (!this.lookupStates) {
          this.lookupStates = new Array<LookupStateModel>();
        }
        response.data.forEach(x => {
          this.lookupStates.push(x.data);
        });
      } else {
        console.log(response);
      }
    });
  }
}

export class LookupStateModel {
  id: number;
  code: string;
  name: string;
}

export enum HTTP_STATUS_CODE {
  OK = 200,
  NOT_FOUND = 404
}

export class ApiModelBase {
  errors: Map<string, string>;
  status: HTTP_STATUS_CODE;
  constructor(object?: any) {
    if (object) {
      const param: Object = object as Object;
      if (param.hasOwnProperty("errors")) {
        this.errors = param["errors"];
      }
      if (param.hasOwnProperty("status")) {
        this.errors = param["status"];
      }
    }
  }
}

export class ApiObjectModel<T> extends ApiModelBase {
  data: T;
  constructor(object?: any) {
    super(object);
    if (object) {
      const param: Object = object as Object;
      if (param.hasOwnProperty("data")) {
        this.data = param["data"];
      }
    }
  }
}

export class ListApiModel<T> extends ApiModelBase {
  data: Array<ApiObjectModel<T>>;
  constructor(object?: any) {
    super(object);
    if (object) {
      const param: Object = object as Object;
      if (param.hasOwnProperty("data")) {
        this.data = param["data"];
      }
    }
  }
}

export class CommonService {
  constructor(private http: HttpClient) {}
  getList<T>(
    url: string,
    httpParams: HttpParams = null,
    httpHeaders: HttpHeaders = null
  ): Observable<ListApiModel<T>> {
    return this.http
      .get<ListApiModel<T>>(url, {
        headers: httpHeaders,
        observe: "response",
        params: httpParams
      })
      .pipe(
        map((response: HttpResponse<ListApiModel<T>>) => {
          let value: ListApiModel<T>;
          if (response.body) {
            value = response.body;
          } else {
            value = new ListApiModel<T>();
          }
          value.status = response.status;
          return value;
        })
      );
  }
}

export class StateService {
  constructor(private api: CommonService) {}
  getList() {
    return this.api.getList<LookupStateModel>(BASE_URL + "/api/state.json").pipe(
      map(value => value),
      catchError(response => {
        const data = new ListApiModel<LookupStateModel>();
        data.data = null;
        if (response && response.error && response.error.errors) {
          data.errors = response.error.errors;
        }
        data.status = response.status;
        return of(data);
      })
    );
  }
}
