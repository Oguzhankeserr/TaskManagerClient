import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Project } from 'src/app/interfaces';
import { ProjectDto } from 'src/app/interfaces/project';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { TaskDto } from 'src/app/interfaces/taskDto';
import { DeleteUserDto, UserDto } from 'src/app/interfaces/user';
import { ProjectService } from 'src/app/services';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

interface DialogData {
  userId: string;
  tasks: TaskDto[];
  projectId: number;
  getAllUsers: UserDto[];
}

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss']
})
export class DeleteUserDialogComponent implements OnInit {
  projectUserList: ProjectUserDto[] = [];
  selectedReporter: string;
  selectedAssignee: string;
  selectedProject: number;
  userList: UserDto[] = this.data.getAllUsers;
  projectList: ProjectDto[] = [];
  isLoading: boolean = false;
 transloco = this.translocoService;
  constructor(
    public dialogRef: MatDialogRef<DeleteUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService,
    private projectService: ProjectService,
    public translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.getProjectUsers();
    this.usersProjects();
  }

  usersProjects(){
    this.userService.getUsersProjects(this.data.userId).subscribe((res) => {
      if (res.isSuccessful) {
        this.projectList = res.data;
      }
    })
  }

  getProjectUsers(){
    this.userService.GetProjectSelectedUsers(this.data.projectId).subscribe((res) => {
      if (res.isSuccessful) {
        this.projectUserList = res.data;
        this.projectUserList.unshift({ id: 'unassigned', userId: 'unassigned', profileImageUrl: '../../assets/user.png' });
        this.selectedAssignee = this.selectedReporter = this.projectUserList[0].userId
      }
    })
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    console.log(this.selectedProject);
    
   
    Swal.fire({
      title: this.transloco.translate('Are you sure?'),
      text: this.transloco.translate("You won't be able to revert this!"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.transloco.translate('Yes, delete it!')
    }).then((result) => {
      if (result.isConfirmed) {
        let deleteUserDto: DeleteUserDto = {
          userId: this.data.userId,
          projectId: this.selectedProject,
          assigneeId: this.selectedAssignee,
          reporterId: this.selectedReporter
        }
        this.isLoading = true;
        this.userService.DeleteUserFromProjectTasks(deleteUserDto).subscribe(async (res) => {
          if (res.isSuccessful == true ) {
            this.isLoading = false;
            this.deleteUserFromProject();
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Tasks cannot be updated!',
              showConfirmButton: false,
            })

          }
        })

      }
    });
  }

  deleteUserFromProject(){
    this.userService.deleteUserFromProjectAfterTasks(this.selectedProject, this.data.userId).subscribe((res) => {
      if (res.isSuccessful) {
        const user = this.userList.find((user) => user.id === this.data.userId);
        Swal.fire(
          this.transloco.translate('Deleted!'),
          this.translocoService.translate('Tasks belonging to {{name}} have been edited, and the user has been deleted.', { name: user ? user.name : 'Unknown' }),
          'success'
        );
        setTimeout(() => {
          this.dialogRef.close();
        }, 3000);
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Tasks are updated but user cannot deleted!',
          showConfirmButton: false,
        })
      }
    })
  }

  deleteUserFromCompany(){
    this.userService.deleteUser(this.data.userId).subscribe((res) => {
      if(res.isSuccessful == true){
        Swal.fire({
          icon: 'success',
          title: 'Kullanıcı başarıyla silindi!',
          showConfirmButton: false,
        })
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Kullanıcı silme işlemi başarısız!',
          showConfirmButton: false,
        }) 
      }
    })
  }
}

