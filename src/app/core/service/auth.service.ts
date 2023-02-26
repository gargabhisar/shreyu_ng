
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '../models/auth.models';
import { loggedInUser } from '../helpers/utils';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    user: User | null = null;
    myAppUrl : string;
    constructor (private http: HttpClient,@Inject("BASE_URL") baseurl: string) {
        this.myAppUrl = baseurl;
    }

    /**
     * Returns the current user
     */
    public currentUser(): User | null {
        if (!this.user) {
            this.user = loggedInUser();
        }
        return this.user;
    }

    /**
     * Performs the login auth
     * @param email email of user
     * @param password password of user
     */
    

    login(email: string, password: string,publicationid:number): any {
        console.log(email, " ", password);
         return this.http.post<any>(this.myAppUrl + `/Login/AuthorLogin`, { userEmail:email, userPassword:password,publicationId:publicationid });
    }


    /**
     * Performs the signup auth
     * @param name name of user
     * @param email email of user
     * @param password password of user
     */
    signup(name: string, email: string, password: string): any {
        return this.http.post<any>(`/api/signup`, { name, email, password })
            .pipe(map(user => user));

    }



    /**
     * Logout the user
     */
    logout(): void {
        // remove user from session storage to log user out
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('token');
        this.user = null;
    }
}


