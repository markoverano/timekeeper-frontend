import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {

  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.employeesAPI;
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  addEmployee(employeeDto: Employee, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?password=${password}`, employeeDto).pipe(
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    );
  }
}