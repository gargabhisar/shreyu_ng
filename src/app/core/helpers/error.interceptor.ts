import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {map} from 'rxjs/operators'
import { AuthenticationService } from '../service/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                 if(event.status == 200 
                    && event.body.statusCode != 200){                        
                        throw new HttpErrorResponse({
                            statusText: event.body.validation.length > 0 ?event.body.validation[0].details: String(event.body.message)
                        });
                }else if(event.status != 200){
                    throw new HttpErrorResponse({
                        statusText: String(event.statusText)
                    });
                }
             }
            return event;
        }),catchError(err => {        
                    if (err.status === 401) {
                        // auto logout if 401 response returned from api
                        this.authenticationService.logout();
                        location.reload();
                    }
        
                    const error = err.error  == undefined ? err.statusText:err.error.message;
                    return throwError({error:  error});
                }));
    }
}
