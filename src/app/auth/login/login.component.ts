import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  returnUrl: string = '/dashboard/ecommerce';
  loginForm!: FormGroup;
  formSubmitted: boolean = false;
  error: string = '';

  showPassword: boolean = false;

  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private titleService: Title
  ) {
    titleService.setTitle("Log In | Shreyu - Responsive Angular and Bootstrap 5 Admin Dashboard Template")
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['garg.abhisar@gmail.com', [Validators.required, Validators.email]],
      password: ['rainbow_8', Validators.required],
      publicationid:[1]
    });

    // reset login status
    this.authenticationService.logout();


    // get return url from route parameters or default to '/'

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard/ecommerce';

  }

  /**
  * convenience getter for easy access to form fields
  */
  get formValues() { return this.loginForm.controls; }


  /**
   * On submit form
   */
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      this.loading = true;
      this.authenticationService.login(this.formValues.email?.value, this.formValues.password?.value,this.formValues.publicationid?.value).subscribe({
        next: (response: any) => {
           // store user details and jwt in session
            sessionStorage.setItem('currentUser', JSON.stringify(response.result.loggedInUser));
            sessionStorage.setItem('token', JSON.stringify(response.result.token));
            this.router.navigate([this.returnUrl]);
        },
        error: (error: any) => { 
          this.error = error.error;
          this.loading = false;},
       });
     
    }
  }


}
