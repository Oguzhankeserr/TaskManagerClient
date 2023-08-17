import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ResponseModel } from 'src/app/interfaces/responseModel';
import { UserDto } from 'src/app/interfaces/user';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ProjectUserList } from 'src/app/interfaces/projectUserDto';
import { ProjectService } from 'src/app/services';



@Component({
  selector: 'app-add-people-to-project',
  templateUrl: './add-people-to-project.component.html',
  styleUrls: ['./add-people-to-project.component.scss'], 
})
export class AddPeopleToProjectComponent implements OnInit{
  users: UserDto[] = [];
  newProjectName: any;
  addedList : ProjectUserList;
  selectedUsers: UserDto[] = [];

  constructor(public translocoService: TranslocoService,
    private userService : UserService,
    private projectService : ProjectService) { }
  ngOnInit() 
  {
    this.getAllUsers();
    this.newProjectName = localStorage.getItem('newProject');
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(resp=>{
      if(resp.isSuccessful){
        this.users=resp.data
        console.log(this.users);
        
      }else{
        //alert error
      }
    });
  }

  onCheckboxChange(user: UserDto){
    const index = this.selectedUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.selectedUsers.splice(index, 1);
    } 
    else {
      this.selectedUsers.push(user); 
    }
    
  }
  saveProjectUsers() {
    this.addedList.projectId = this.projectService.getProjectLocal().id;
    this.addedList.users = this.selectedUsers;
    this.userService.AddUserToProject(this.addedList).subscribe((res) => {
      console.log(res.data);
      
    })
  }
  
}
export class ButtonOverviewExample {}


