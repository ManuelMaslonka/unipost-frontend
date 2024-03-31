import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../../shared/user.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.sass'],
})
export class UserTableComponent implements OnInit {
  adminService = inject(AdminService);
  modalService = inject(NgbModal);
  authService = inject(AuthService);
  selectedUser!: User;
  loggedUser!: User;
  editForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    nickName: new FormControl(''),
    faculty: new FormControl(''),
    email: new FormControl(''),
  });

  users$ = this.adminService.users$;

  onDelete(userId: number) {
    this.adminService.deleteUserById(userId);
  }

  onOpen(content: any) {
    this.modalService.open(content, { size: 'ml', scrollable: true });
  }

  onEdit(user: User) {
    this.selectedUser = user;
    this.editForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      nickName: user.nickName,
      faculty: user.faculty,
      email: user.email,
    });
  }

  ngOnInit(): void {
    this.adminService.getUsersFromBackend();
    this.authService.user.subscribe((user) => {
      if (user) {
        this.loggedUser = user;
      }
    });
  }

  onPromote(userId: number) {
    this.adminService.promoteUser(userId);
  }

  onSubmit() {
    this.adminService.updateUser(this.selectedUser.userId, this.editForm);
  }

  onBanForDay(userId: number) {
    this.adminService.banUserforDay(userId);
  }

  onBanForWeek(userId: number) {
    this.adminService.banUserforWeek(userId);
  }

  onBanPermanently(userId: number) {
    this.adminService.banUserPertamently(userId);
  }
}
