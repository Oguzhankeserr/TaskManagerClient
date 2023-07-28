import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPeopleToProjectComponent } from '../../create-project/add-people-to-project/add-people-to-project.component';
import { AddUserToProjectComponent } from '../../add-user-to-project/add-user-to-project.component';
import { AddUsersToProjectComponent } from './add-users-to-project/add-users-to-project.component';
import { ProjectService } from 'src/app/services';
import { Project } from 'src/app/interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ProjectDto } from 'src/app/interfaces/project';

@Component({
  selector: 'app-admin-projects',
  templateUrl: './admin-projects.component.html',
  styleUrls: ['./admin-projects.component.scss']
})
export class AdminProjectsComponent {
  @ViewChild(MatSort) sort: MatSort;

  projects : Project[] = [];
  dataSource : MatTableDataSource<ProjectDto>;
  displayedColumns: string[] = ['Name','CreatedDate'];
  constructor(public dialog: MatDialog,private projectService: ProjectService) { }

  ngOnInit() {
    this.projectService.getAllProjects().subscribe((response) => {
      if(response.data != null){
        this.projects = response.data;
            this.dataSource = new MatTableDataSource<ProjectDto>(this.projects);

      }
      
    });

  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddUsersToProjectComponent,{height: '90%',width: '50%', panelClass: 'dialog'});
  }
}