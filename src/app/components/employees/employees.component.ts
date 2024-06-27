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
    phone: '',
    roleId: 1
  };

  constructor(private employeeService: EmployeeManagementService) { }

  ngOnInit(): void {
    // this.loadEmployees();
    this.loadMockEmployees();
  }
  
  loadMockEmployees() {
    this.employees = [
      { id: 1, firstName: 'Juan', lastName: 'Balagtas', email: 'adsfas@.com', phone: '1234567890', roleId: 1 },
      { id: 2, firstName: 'Pedro', lastName: 'Pindotdot', email: 'asdfasfasd.com', phone: '9876543210', roleId: 2 },
    ];
  }
  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe(employees => {
      this.employees = employees;
    });
  }

  addEmployee() {
    this.employeeService.addEmployee(this.newEmployee).subscribe(() => {
      this.loadEmployees();
      this.resetForm();
    });
  }

  resetForm() {
    this.newEmployee = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      roleId: 1
    };
  }
}