import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/service.auth'

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    public test: Date = new Date();
    public signInObject: SignInObject = {
        email: '',
        password: ''
    };

    constructor(private authService: AuthService) { }

    ngOnInit() {}

    public onSignInClick(): void {
        console.log('onSignInClick >>> ', this.signInObject);
        this.authService.signIn(this.signInObject.email, this.signInObject.password);
    }
}

interface SignInObject {
    email: string,
    password: string
}
