
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { RequestInterceptor } from "./request.interceptor.service";
import { ResponseInterceptor } from "./response.interceptor.service";

export function provideInterceptors(): EnvironmentProviders {
  const interceptors = [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
  ];
  return makeEnvironmentProviders(interceptors);
}