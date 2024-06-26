import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeManagementService {
  private attendanceEntries: Array<{ date: string, timeIn: string, timeOut: string }> = [];
  private isAdmin: boolean = false;

  constructor() { }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }

  getAttendanceEntries() {
    return this.attendanceEntries;
  }

  timeIn() {
    const date = new Date().toLocaleDateString();
    const timeIn = new Date().toLocaleTimeString();
    this.attendanceEntries.push({ date, timeIn, timeOut: '' });
  }

  timeOut() {
    const latestEntry = this.attendanceEntries[this.attendanceEntries.length - 1];
    if (latestEntry) {
      latestEntry.timeOut = new Date().toLocaleTimeString();
    }
  }

  switchAdmin() {
    this.isAdmin = !this.isAdmin;
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  updateAttendanceEntry(index: number, timeIn: string, timeOut: string) {
    this.attendanceEntries[index] = { ...this.attendanceEntries[index], timeIn, timeOut };
  }
}