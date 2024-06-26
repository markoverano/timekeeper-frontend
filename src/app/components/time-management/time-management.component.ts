import { Component, OnInit } from '@angular/core';
import { TimeManagementService } from 'src/app/services/time-management.service';

@Component({
  selector: 'app-time-management',
  templateUrl: './time-management.component.html',
  styleUrls: ['./time-management.component.css']
})
export class TimeManagementComponent implements OnInit {
  currentTime: string = '';
  isTimedIn: boolean = false;

  constructor(private timeMgtSvc: TimeManagementService) { }

  ngOnInit(): void {
    setInterval(() => {
      this.currentTime = this.timeMgtSvc.getCurrentTime();
    }, 1000);
  }

  toggleTime() {
    if (this.isTimedIn) {
      this.timeMgtSvc.timeOut();
    } else {
      this.timeMgtSvc.timeIn();
    }
    this.isTimedIn = !this.isTimedIn;
  }

  switchAdmin() {
    this.timeMgtSvc.switchAdmin();
  }

  updateEntry(index: number, timeIn: string, timeOut: string) {
    this.timeMgtSvc.updateAttendanceEntry(index, timeIn, timeOut);
  }

  get isAdmin() {
    return this.timeMgtSvc.getIsAdmin();
  }

  get attendanceEntries() {
    return this.timeMgtSvc.getAttendanceEntries();
  }
}
