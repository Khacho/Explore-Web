import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';


@Injectable()
export class AuthService {
    public isSignedIn =  false;

    constructor(private fireAuth: AngularFireAuth,  private router: Router) {};

    public signIn(email: string, password: string): void {
        this.fireAuth.auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
            console.log('Signed in');
            this.isSignedIn = true;
            this.router.navigate(['/user-profile']);
       })
       .catch(error => console.log(error));
    }

    public signOut(): void {
        this.fireAuth.auth.signOut()
        .then((obj) => {
            console.log('Signed out');
            this.isSignedIn = false;
            this.router.navigate(['/signin']);
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
