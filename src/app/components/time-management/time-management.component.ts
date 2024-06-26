import { Component, OnInit } from '@angular/core';
import { AttendanceEntry, TimeManagementService } from 'src/app/services/time-management.service';

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
      this.currentTime = new Date().toLocaleTimeString();
    }, 1000);
    this.loadEntries();
  }

  loadEntries() {
    this.timeMgtSvc.getAllEntries().subscribe(entries => {
      this.attendanceEntries = entries;
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
    const entry: AttendanceEntry = {
      id: 0,
      date: new Date().toLocaleDateString(),
      timeIn: new Date().toLocaleTimeString(),
      timeOut: ''
    };
    this.timeMgtSvc.addEntry(entry).subscribe(() => {
      this.loadEntries();
    });
  }

  timeOut() {
    const latestEntry = this.attendanceEntries[this.attendanceEntries.length - 1];
    if (latestEntry) {
      latestEntry.timeOut = new Date().toLocaleTimeString();
      this.timeMgtSvc.updateEntry(latestEntry).subscribe(() => {
        this.loadEntries();
      });
    }
  }

  switchAdmin() {
    this.isAdmin = !this.isAdmin;
  }

  updateEntry(index: number, timeIn: string, timeOut: string) {
    const entry = this.attendanceEntries[index];
    entry.timeIn = timeIn;
    entry.timeOut = timeOut;
    this.timeMgtSvc.updateEntry(entry).subscribe(() => {
      this.loadEntries();
    });
  }

  deleteEntry(id: number) {
    this.timeMgtSvc.deleteEntry(id).subscribe(() => {
      this.loadEntries();
    });
  }
}