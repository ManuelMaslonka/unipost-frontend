import {Injectable, OnInit} from "@angular/core";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../auth/auth.service";
import {User} from "../shared/user.model";

@Injectable({
    providedIn: 'root'
})
export class FriendsService implements OnInit{

    private baseUrl: string = 'http://localhost:8080';

    user!: User;
    friends: User[] = [];
    friendsChanged: Subject<User[]> = new Subject<User[]>();


    constructor(private http: HttpClient,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.user.subscribe(
            (user) => {
              if (user) {
                this.user = user
                console.log(user)
              }
            }
        )
    }



    getFriendsByHttp(userId: number) {

        this.http.post<User[]>(
            this.baseUrl + "/users/friends/" + userId, {}
        ).subscribe(resData => {
            this.friends = resData;
            this.updatedFriends()
        })
    }

    updatedFriends(): void {
        this.friendsChanged.next(this.friends.slice());
    }

    getFriends(): User[] {
        return this.friends
    }


}
