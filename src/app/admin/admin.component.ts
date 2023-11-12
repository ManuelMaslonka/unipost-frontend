import {Component, inject, OnInit} from '@angular/core';
import {AdminService} from "./admin.service";
import {User} from "../shared/user.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {

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


  users$ = this.adminService.users$;


  onDelete(userId: number) {
    this.adminService.deleteUserById(userId);
  }

  onOpen(content: any) {
    this.modalService.open(content, {size: 'ml', scrollable: true});
  }

  onEdit(user: User) {
    this.selectedUser = user;
    this.editForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      nickName: user.nickName,
      faculty: user.faculty,
      email: user.email
    })
  }

  ngOnInit(): void {
    this.adminService.getUsersFromBackend();
    this.authService.user.subscribe(
      user => {
        if (user) {
    this.loggedUser = user;
        }
      }
    );
  }

  onPromote(userId: number) {
    this.adminService.promoteUser(userId);
  }

  onSubmit() {
    this.adminService.updateUser(this.selectedUser.userId, this.editForm);
  }
}
