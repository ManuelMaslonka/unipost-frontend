import {Injectable} from "@angular/core";
import {Friend}     from "./friend.model";
import {Subject}    from "rxjs";
import {Post}       from "../home/posts/post/post.model";

@Injectable({
    providedIn: 'root'
})
export class FriendsService {
    friendsChanged: Subject<Friend[]> = new Subject<Friend[]>();

    friends: Friend[] = [
        new Friend("./assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg", "Manuel Mašlonka"),
        new Friend("./assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg", "Manuel Mašlonka"),
        new Friend("./assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg", "Manuel Mašlonka"),
        new Friend("./assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg", "Manuel Mašlonka"),
        new Friend("./assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg", "Manuel Mašlonka")
    ]

    updatedFriends(): void {
        this.friendsChanged.next(this.friends.slice());
    }

    getFriends(): Friend[] {
        return this.friends
    }
}
