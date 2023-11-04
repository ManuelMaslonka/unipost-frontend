import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {SearchService} from "./search.service";
import {User} from "../shared/user.model";
import {Subscription} from "rxjs";
import {SafeUrl} from "@angular/platform-browser";
import {AuthService} from "../auth/auth.service";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass']
})
export class SearchComponent implements OnInit, OnDestroy {

  searchForm = this.fb.group({
    search: ['', [Validators.required, Validators.minLength(3)]]
  })
  searchedUsers: User[] = [];
  isSearched: boolean = false;
  searchSub: Subscription = new Subscription();
  images: SafeUrl[] = [];

  constructor(private fb: FormBuilder,
              private searchService: SearchService,
              private authService: AuthService
  ){
  }

  ngOnInit(): void {

  }

  get search() {
    return this.searchForm.get('search')
  }

  onSubmit(searchContent: string) {
    this.searchSub = this.searchService.search(searchContent).subscribe(
      searchedUsers => {
        this.searchedUsers = searchedUsers;
        this.isSearched = true;
        console.log(this.searchedUsers)
      })
  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }


}
