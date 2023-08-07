import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ListTask } from 'src/app/interfaces/listTask';
import { TokenService } from 'src/app/services/token.service';
import { ColumnService, ProjectService, TaskService } from 'src/app/services';
import { Task } from 'src/app/interfaces/task';
import { Project } from 'src/app/interfaces';

// TranslocoService'i import edin.
import { TranslocoService } from '@ngneat/transloco';
import { PriorityService } from 'src/app/services/priority.service';
import { ProjectUserDto } from 'src/app/interfaces/projectUserDto';
import { UserService } from 'src/app/services/user.service';
import { ColumnDto } from 'src/app/interfaces/columnDto';
import { MatMenuTrigger } from '@angular/material/menu';
import { UserDto } from 'src/app/interfaces/user';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ListComponent implements OnInit {
  @ViewChild('filterMenu', { static: true }) filterMenu: MatMenuTrigger;

  listData: ListTask[] = [];
  filteredData: ListTask[] = [];
  userList: UserDto[] = [];
  columns: string[] = [
    'name', 'columnId', 'assigneeId', 'reporterId', 'DueDate',
    'ListTask.Priority', 'UpdateDate', 'CreateDate',
  ];
  fromDate: Date; updatedFromDate: Date; createdFromDate: Date ;
  toDate: Date; updatedToDate: Date; createdToDate: Date;
  priorities: string[] = [];
  activeFilters: string[] = [];
  projectUsers: ProjectUserDto[] = [];
  projectColumns: ColumnDto[] = [];
  selectedColumns: number[] = [];
  isColumnMenuOpen = false;
  customMenuClass = 'custom-menu-panel'
  selectedPriorities: number[] = [];
  appliedFilter: number = 0;

  constructor(
    private http: HttpClient,
    public tokenService: TokenService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private translocoService: TranslocoService,
    public priorityService: PriorityService,
    public userService: UserService,
    private columnService: ColumnService
  ) { }

  ngOnInit(): void {
    let id: number = this.projectService.getProjectLocal().id;
    this.taskService.getAllProjectTask({ "id": id }).subscribe((res) => {
      if (res.isSuccessful == true) {
        console.log(res.data);
        this.listData = res.data;
        this.filteredData = res.data;
        this.applySummaryFilters();
      }
    });

    this.userService.GetAllProjectUsers({ "id": id }).subscribe((res) => {
      if (res.isSuccessful == true) {
        this.projectUsers = res.data;
      }
    })

    this.columnService.GetAllProjectColumns({ "id": id }).subscribe((res) => {
      if (res.isSuccessful == true) {
        this.projectColumns = res.data;
      }
    })

    this.userService.getAllUsers().subscribe((res) => {
      if (res.isSuccessful == true) {
        this.userList = res.data;
      }
    })
    this.priorities = this.priorityService.getOptions();
  }

  applySummaryFilters() {
    const selectedFilter = this.taskService.getSelectedFilter();
    if (selectedFilter && selectedFilter.name === 'UpdatedDate') {
      this.updatedFromDate = new Date(selectedFilter.fromDate);
      this.updatedToDate = new Date(selectedFilter.toDate);
      console.log(this.updatedFromDate);

      this.applyFilter('UpdatedDate');
    }
    if (selectedFilter && selectedFilter.name === 'CreatedDate') {
      this.createdFromDate = new Date(selectedFilter.fromDate);
      this.createdToDate = new Date(selectedFilter.toDate);
      this.applyFilter('CreatedDate');
    }
  }



  applyFilter(filter: string) {
    this.filteredData = this.listData;

    if (this.activeFilters.includes(filter)) {
      if (filter == 'AssignedToMe' || filter == 'DueDateThisWeek' || filter == 'CompletedTasks') {
        this.activeFilters = this.activeFilters.filter(f => f !== filter);
      }
    }
    else {
      this.activeFilters.push(filter);
    }

    if (this.activeFilters.includes('AssignedToMe')) {
      this.filteredData = this.filteredData.filter(t => t.assigneeId == this.tokenService.tokenUserId());
    }

    if (this.activeFilters.includes('DueDateThisWeek')) {
      const currentDate = new Date();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(currentDate);
      endOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 6);

      this.filteredData = this.filteredData.filter(t => {
        const dueDate = new Date(t.dueDate);
        return dueDate >= startOfWeek && dueDate <= endOfWeek
      });

    }
    // else if (filter === 'CompletedTasks') {
    // }
    if (this.activeFilters.includes('BetweenDates')) {
      const fromDate = new Date(this.fromDate);
      if (this.fromDate && this.toDate) {
        const toDate = new Date(this.toDate);
        this.filteredData = this.filteredData.filter(t => {
          const taskCreateDate = new Date(t.createdDate);
          const taskUpdatedDate = new Date(t.updatedDate);
          const taskDueDate = new Date(t.dueDate);
          return ((taskCreateDate >= fromDate && taskCreateDate <= toDate) ||
            (taskUpdatedDate >= fromDate && taskUpdatedDate <= toDate) ||
            (taskDueDate >= fromDate && taskDueDate <= toDate));
        });
      }
      else if (this.fromDate) {
        this.filteredData = this.filteredData.filter(t => {
          const taskCreateDate = new Date(t.createdDate);
          const taskUpdatedDate = new Date(t.updatedDate);
          const taskDueDate = new Date(t.dueDate);
          return ((taskCreateDate >= fromDate) ||
            (taskUpdatedDate >= fromDate) ||
            (taskDueDate >= fromDate));
        });
      }
    }

    if (this.activeFilters.includes('AssignedTo')) {
      //user objesi oluşturulacak, seçilen user ona verilecek buraya sadece id gerekli
      //this.filteredData = this.filteredData.filter(t => t.assigneeId == this.user.id);
    }

    if (this.activeFilters.includes('Columns') && this.selectedColumns.length != 0) {
      this.filteredData = this.filteredData.filter(t => this.selectedColumns.includes(t.columnId));
    }

    if (this.activeFilters.includes('UpdatedDate')) {
      if (this.updatedFromDate && this.updatedToDate) {
        this.filteredData = this.filteredData.filter(t => {
          const taskUpdatedDate = new Date(t.updatedDate);
          return (taskUpdatedDate >= this.updatedFromDate && taskUpdatedDate <= this.updatedToDate);
        });
      }
      else if (this.updatedFromDate) {
        this.filteredData = this.filteredData.filter(t => {
          const taskUpdatedDate = new Date(t.updatedDate);
          return (taskUpdatedDate >= this.updatedFromDate);
        });
      }
    }


    if (this.activeFilters.includes('CreatedDate')) {
      if (this.createdFromDate && this.createdToDate) {
        this.filteredData = this.filteredData.filter(t => {
          const taskCreatedDate = new Date(t.createdDate);
          return (taskCreatedDate >= this.createdFromDate && taskCreatedDate <= this.createdToDate);
        });
      }
      else if (this.createdFromDate) {
        this.filteredData = this.filteredData.filter(t => {
          const taskCreatedDate = new Date(t.createdDate);
          return (taskCreatedDate >= this.createdFromDate);
        });
      }
    }

    if (this.activeFilters.includes('Reporter')) {
      //user objesi oluşturulacak, seçilen user ona verilecek buraya sadece id gerekli
      //this.filteredData = this.filteredData.filter(t => t.reporterId == this.user.id);
    }

    if (this.activeFilters.includes('Priorities') && this.selectedPriorities.length != 0) {
      this.filteredData = this.filteredData.filter(t => this.selectedPriorities.includes(t.priority));
    }
  }

  handlePriorityClick(priority: number) {
    if (this.selectedPriorities.includes(priority)) {
      this.selectedPriorities = this.selectedPriorities.filter(p => p !== priority);
    }
    else {
      this.selectedPriorities.push(priority);
    }
    this.applyFilter('Priorities');
  }


  handleColumnSelect(columnId: number) {
    if (this.selectedColumns.includes(columnId)) {
      this.selectedColumns = this.selectedColumns.filter(id => id !== columnId);
    }
    else {
      this.selectedColumns.push(columnId);
    }
    this.applyFilter('Columns');
  }

  cancelPriorities() {
    if (this.selectedPriorities.length != 0) {
      this.selectedPriorities = [];
    }
    this.applyFilter('Priorities');
  }

  cancelCreateDates() {
    //this.createdFromDate = undefined
    // this.createdToDate = undefined;
  }

  clearFilter() {
    this.selectedColumns = [];
    this.selectedPriorities = [];
    this.activeFilters = [];
    //dates;
    this.filteredData = this.listData;
  }

  loadData(): void {
    this.http.get<ListTask[]>('YOUR_BACKEND_URL_HERE').subscribe(
      (response: ListTask[]) => {
        this.listData = response;
        this.filteredData = [...this.listData];
      },
      (error: any) => {
        console.error('Veri yüklenirken bir hata oluştu:', error);
      }
    );
  }

  filterByName(searchText: string): void {
    console.log("filterByName fonksiyonu çağrıldı:", searchText);
    this.filteredData = this.listData.filter(item =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  handleUsernameClick(): void {
    console.log('User name clicked!');
  }

  addPerson(): void {
    console.log("Kişi Ekle butonuna tıklandı!");
  }

  // Örnek Transloco kullanım metodu:
  someMethod(): void {
    const translatedText = this.translocoService.translate('your_translation_key');
    console.log(translatedText);
  }



}
