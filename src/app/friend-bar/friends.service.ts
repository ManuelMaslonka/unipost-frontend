import {Injectable} from "@angular/core";
import {Friend}     from "./friend.model";

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  friends: Friend[] = [
    new Friend("./assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg", "Manuel Mašlonka"),
    new Friend("./assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg", "Manuel Mašlonka"),
    new Friend("./assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg", "Manuel Mašlonka"),
    new Friend("./assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg", "Manuel Mašlonka"),
    new Friend("./assets/images/priscilla-du-preez-nF8xhLMmg0c-unsplash.jpg", "Manuel Mašlonka")
  ]

}
