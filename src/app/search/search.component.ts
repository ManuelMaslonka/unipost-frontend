import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {SearchService} from "./search.service";
import {User} from "../shared/user.model";
import {Subscription} from "rxjs";


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

  constructor(private fb: FormBuilder,
              private searchService: SearchService) {
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
      })
  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
  }


}
