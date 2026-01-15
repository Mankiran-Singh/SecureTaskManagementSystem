import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get(`${environment.apiUrl}/tasks`);
  }

  createTask(data: any) {
    return this.http.post(`${environment.apiUrl}/tasks`, data);
  }

  updateStatus(taskId: string, status: string) {
    return this.http.put(`${environment.apiUrl}/tasks/${taskId}/status`, { status });
  }

  deleteTask(taskId: string) {
    return this.http.delete(`${environment.apiUrl}/tasks/${taskId}`);
  }
}
