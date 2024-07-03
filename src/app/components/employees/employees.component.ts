import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeManagementService } from 'src/app/services/employee-service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  newEmployee: Employee = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    roleId: 0
  };

  password: string = '';
  confirmPassword: string = '';

  constructor(private employeeService: EmployeeManagementService) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe(employees => {
      this.employees = employees;
    }, error => {
      console.error('Error loading employees:', error);
    });
  }

  addEmployee() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (this.newEmployee.roleId === 0) {
      alert('Please select a role!');
      return;
    }
    this.employeeService.addEmployee(this.newEmployee, this.password).subscribe(() => {
      this.loadEmployees();
      this.resetForm();
    }, error => {
      console.error('Error adding employee:', error);
    });
  }



  resetForm() {
    this.newEmployee = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      roleId: 0
    };

    this.password = '';
    this.confirmPassword = '';
  }
}