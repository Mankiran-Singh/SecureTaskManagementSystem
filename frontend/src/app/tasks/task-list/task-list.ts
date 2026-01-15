import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TaskService } from '../../services/task.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterModule], 
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskList implements OnInit {

  tasks:any=[];

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {}

 ngOnInit(): void {
  console.log('TaskList INIT');

  this.taskService.getTasks().subscribe(res => {
    console.log('Tasks received:', res);
    this.tasks = res;
    this.cdr.detectChanges(); 
  });
}

ngOnDestroy(): void {
  console.log('TaskList DESTROYED');
}

  trackById(index: number, task: any) {
  return task._id;
}

}
