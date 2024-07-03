import { Component, OnInit } from '@angular/core';
import { AttendanceEntry, TimeManagementService } from 'src/app/services/time-management.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { AuthService } from 'src/app/services/auth.service';
import { Employee, EmployeeManagementService } from 'src/app/services/employee-service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-time-management',
  templateUrl: './time-management.component.html',
  styleUrls: ['./time-management.component.css']
})
export class TimeManagementComponent implements OnInit {
  currentTime: string = '';
  isTimedIn: boolean = false;
  attendanceEntries: AttendanceEntry[] = [];
  isAdmin: boolean = false;
  employeeId: number = 0;
  employees: Employee[] = [];
  selectedEmployee: number = 0;

  constructor(private timeMgtSvc: TimeManagementService,
    private authService: AuthService,
    private employeeService: EmployeeManagementService,
    private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.employeeId = this.authService.getEmployeeId();
    this.isAdmin = this.authService.isAdmin();

    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);

    this.loadEntries(this.employeeId);
    if (this.isAdmin) {
      this.loadEmployees();
    }
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe(employees => {
      this.employees = employees;
      this.transformEntries();
    });
  }

  loadEntries(employeeId: number) {
    if (this.isAdmin && this.selectedEmployee == 0) {
      this.timeMgtSvc.getAllEntries().subscribe(entries => {
        this.attendanceEntries = entries;
        this.timeMgtSvc.updateEntries(entries);
        this.checkIfTimedIn();
        this.transformEntries();
      });
    }
    else {
      this.timeMgtSvc.getEntriesByEmployeeIdAsync(employeeId).subscribe(entries => {
        this.attendanceEntries = entries;
        this.timeMgtSvc.updateEntries(entries);
        this.checkIfTimedIn();
        this.transformEntries();
      });
    }
  }

  onEmployeeChange(event: any) {
    this.selectedEmployee = event.target.value;
    this.loadEntries(this.selectedEmployee);
  }

  checkIfTimedIn() {
    const latestEntry = this.attendanceEntries.find(entry => this.utilsService.compareDates(entry.date) && entry.employeeId === this.employeeId && !entry.timeOut);
    this.isTimedIn = latestEntry != undefined;
  }

  toggleTime() {
    if (this.isTimedIn) {
      this.timeOut();
    }
    else {
      this.timeIn();
    }
    this.isTimedIn = !this.isTimedIn;
  }

  timeIn() {
    this.timeMgtSvc.addEntry(this.employeeId).subscribe((response) => {
      this.loadEntries(this.employeeId);
    }, (error) => {
      console.error('Error:', error);
    });
  }

  timeOut() {
    const latestEntry = this.attendanceEntries[this.attendanceEntries.length - 1];
    if (latestEntry) {
      latestEntry.timeOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.timeMgtSvc.timeOut(this.employeeId).subscribe({
        next: () => {
          this.loadEntries(this.employeeId);
        },
        error: (err) => {
          console.error('Error updating entry:', err);
          alert('Error updating entry. Please try again.');
          latestEntry.timeOut = '';
        }
      });
    }
  }

  editEntry(entry: AttendanceEntry) {
    entry.isEditing = true;

    if (!entry.formattedTimeIn) {
      entry.formattedTimeIn = '12:00 AM';
    }
    
    const timeInParts = this.utilsService.parseTime(entry.formattedTimeIn);
    entry.parsedTimeIn = {
      hour: timeInParts.hour,
      minutes: timeInParts.minutes,
      period: timeInParts.period
    };

    if (!entry.formattedTimeOut) {
      entry.formattedTimeOut = '12:00 AM';
    }

    const timeOutParts = this.utilsService.parseTime(entry.formattedTimeOut);
    entry.parsedTimeOut = {
      hour: timeOutParts.hour,
      minutes: timeOutParts.minutes,
      period: timeOutParts.period
    };
  }

  saveEdit(entry: AttendanceEntry) {
    entry.isEditing = false;

    entry.timeInString = `${entry.parsedTimeIn.hour}:${entry.parsedTimeIn.minutes} ${entry.parsedTimeIn.period}`;
    entry.timeOutString = `${entry.parsedTimeOut.hour}:${entry.parsedTimeOut.minutes} ${entry.parsedTimeOut.period}`;

    this.timeMgtSvc.updateEntry(entry).subscribe(() => {
      this.loadEntries(this.employeeId);
    });
  }

  deleteEntry(id: number) {
    this.timeMgtSvc.deleteEntry(id).subscribe(() => {
      this.loadEntries(this.employeeId);
    });
  }

  transformEntries() {
    if (this.employees.length > 0 && this.attendanceEntries.length > 0) {
      this.attendanceEntries = this.attendanceEntries.map(entry => {
        const employee = this.employees.find(emp => emp.id === entry.employeeId);
        if (employee) {
          entry.employeeName = `${employee.firstName} ${employee.lastName}`;
        }
        return entry;
      });
    }
  }

  cancelEdit(entry: AttendanceEntry) {
    entry.isEditing = false;
  }

  exportToPDF() {
    const doc = new jsPDF();
    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Time In', dataKey: 'timeIn' },
      { header: 'Time Out', dataKey: 'timeOut' }
    ];

    let data;
    if (this.isAdmin && this.selectedEmployee == 0) {
      columns.unshift({ header: 'Employee', dataKey: 'employeeName' });

      data = this.attendanceEntries.map(entry => ({
        employeeName: entry.employeeName || '',
        date: entry.formattedEntryDate,
        timeIn: entry.formattedTimeIn || '',
        timeOut: entry.formattedTimeOut || ''
      }));
    }
    else {
      const employee = this.employees.find(emp => emp.id == this.selectedEmployee);
      const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';

      doc.text(`Employee: ${employeeName}`, 10, 10);

      data = this.attendanceEntries.map(entry => ({
        date: entry.formattedEntryDate,
        timeIn: entry.formattedTimeIn || '',
        timeOut: entry.formattedTimeOut || ''
      }));
    }

    (doc as any).autoTable({
      columns: columns,
      body: data,
      startY: 20
    });

    doc.save(`${new Date().toLocaleDateString()} - Time Entries.pdf`);
  }
}