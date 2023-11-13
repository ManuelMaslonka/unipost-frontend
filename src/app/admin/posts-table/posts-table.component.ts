import {Component, inject} from '@angular/core';
import {AdminService} from "../admin.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../auth/auth.service";
import {User} from "../../shared/user.model";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-posts-table',
  templateUrl: './posts-table.component.html',
  styleUrls: ['./posts-table.component.sass']
})
export class PostsTableComponent {

  adminService = inject(AdminService);
  modalService = inject(NgbModal);
  authService = inject(AuthService);
  selectedUser!: User;
  loggedUser!: User;
  editForm = new FormGroup({
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    nickName: new FormControl(""),
    faculty: new FormControl(""),
    email: new FormControl("")
  })


  posts$ = this.adminService.posts$;


  onDelete(postId: number) {
    this.adminService.deletePostById(postId);
  }


  ngOnInit(): void {
    this.adminService.getPostsFromBackend();
  }



}
