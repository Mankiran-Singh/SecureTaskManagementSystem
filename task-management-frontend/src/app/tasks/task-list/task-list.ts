import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatCardModule], 
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskList implements OnInit {

  tasks: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((res: any) => {
      console.log('Tasks:', res);
      this.tasks = res;
    });
  }
}
