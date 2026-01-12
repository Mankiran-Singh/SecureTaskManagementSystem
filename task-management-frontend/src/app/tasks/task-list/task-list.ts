import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [MatCardModule, CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  tasks: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((res: any) => {
      console.log('Tasks:', res);
      this.tasks = res;
    });
  }
}
