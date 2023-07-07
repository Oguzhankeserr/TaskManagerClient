import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CreateProjectPageComponent } from './create-project-page/create-project-page.component';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/interfaces';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
  projectName : string;
  projects : Project[] = [];
  

  constructor(
    private bottomSheet: MatBottomSheet,
    public projectService: ProjectService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe((response) => {
      if(response.data != null){
        this.projects = response.data;
      }
      debugger;
    });
       
  }
  
  createProject(){
    this.projectService.createProject({name: this.projectName}).subscribe(() => {
      this.ngOnInit();
    });
    // console.log(this.projectName);
  }

  closeDialog() {
    const dialogRef = this.dialog.closeAll()
  }



    

  showFiller = false;
  openBottomSheet() {
    this.bottomSheet.open(CreateProjectPageComponent, {
      
    });
  }


}
