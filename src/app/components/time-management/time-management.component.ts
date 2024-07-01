import { Component, OnInit } from '@angular/core';
import { AttendanceEntry, TimeManagementService } from 'src/app/services/time-management.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private timeMgtSvc: TimeManagementService, private authService: AuthService) { }

  ngOnInit(): void {
    this.employeeId = this.authService.getEmployeeId();
    this.isAdmin = this.authService.isAdmin();

    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);
    this.loadEntries(this.employeeId);
  }

  loadEntries(employeeId: number) {
    if (this.isAdmin) {
      this.timeMgtSvc.getAllEntries().subscribe(entries => this.timeMgtSvc.updateEntries(entries));
    }
    else {
      this.timeMgtSvc.getEntriesByEmployeeIdAsync(this.employeeId).subscribe(entries => this.timeMgtSvc.updateEntries(entries));
    }
  }

  toggleTime() {
    if (this.isTimedIn) {
      this.timeOut();
    } else {
      this.timeIn();
    }
    this.isTimedIn = !this.isTimedIn;
  }

  timeIn() {
    this.timeMgtSvc.addEntry(1).subscribe(() => {
      this.loadEntries(this.employeeId);
    });
  }

  timeOut() {
    const latestEntry = this.attendanceEntries[this.attendanceEntries.length - 1];
    if (latestEntry) {
      latestEntry.timeOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.timeMgtSvc.updateEntry(latestEntry).subscribe(() => {
        this.loadEntries(this.employeeId);
      });
    }
  }

  editEntry(entry: AttendanceEntry) {
    entry.isEditing = true;
  }

  saveEdit(entry: AttendanceEntry) {
    entry.isEditing = false;
    this.timeMgtSvc.updateEntry(entry).subscribe(() => {
      this.loadEntries(this.employeeId);
    });
  }

  deleteEntry(id: number) {
    this.timeMgtSvc.deleteEntry(id).subscribe(() => {
      this.loadEntries(this.employeeId);
    });
  }

  exportToPDF() {
    const doc = new jsPDF();

    const employeeName = 'John Doe';
    doc.text(`Employee: ${employeeName}`, 10, 10);

    const columns = [
      { header: 'Date', dataKey: 'date' },
      { header: 'Time In', dataKey: 'timeIn' },
      { header: 'Time Out', dataKey: 'timeOut' }
    ];

    const data = this.attendanceEntries.map(entry => ({
      date: entry.formattedEntryDate,
      timeIn: entry.formattedTimeIn || '',
      timeOut: entry.timeOut || ''
    }));

    (doc as any).autoTable({
      columns: columns,
      body: data,
      startY: 20
    });

    doc.save(`${new Date().toLocaleDateString()} - Time Entries.pdf`);
  }
}