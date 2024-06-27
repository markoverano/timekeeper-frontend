import { Component, OnInit } from '@angular/core';
import { AttendanceEntry, TimeManagementService } from 'src/app/services/time-management.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

  constructor(private timeMgtSvc: TimeManagementService) { }

  ngOnInit(): void {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);
    this.loadEntries();
  }

  loadEntries() {
    this.timeMgtSvc.getAllEntries().subscribe(entries => {
      this.attendanceEntries = entries.map(entry => ({ ...entry, isEditing: false }));
    });
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
      this.loadEntries();
    });
  }

  timeOut() {
    const latestEntry = this.attendanceEntries[this.attendanceEntries.length - 1];
    if (latestEntry) {
      latestEntry.timeOut = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.timeMgtSvc.updateEntry(latestEntry).subscribe(() => {
        this.loadEntries();
      });
    }
  }

  switchAdmin() {
    this.isAdmin = !this.isAdmin;
  }

  editEntry(entry: AttendanceEntry) {
    entry.isEditing = true;
  }

  saveEdit(entry: AttendanceEntry) {
    entry.isEditing = false;
    this.timeMgtSvc.updateEntry(entry).subscribe(() => {
      this.loadEntries();
    });
  }

  deleteEntry(id: number) {
    this.timeMgtSvc.deleteEntry(id).subscribe(() => {
      this.loadEntries();
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