import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface AttendanceEntry {
  id: number;
  date: string;
  timeIn: string | '';
  timeOut: string | '';
  formattedTimeIn: string | '';
  formattedTimeOut: string | '';
  isEditing: boolean;
  formattedEntryDate: string | '';
}

@Injectable({
  providedIn: 'root'
})
export class TimeManagementService {

  private apiUrl: string;

  private attendanceEntries: Array<{ date: string, timeIn: string, timeOut: string }> = [];
  private isAdmin: boolean = false;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.attendanceAPI;
  }

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

  //___________

  getAllEntries(): Observable<AttendanceEntry[]> {
    return this.http.get<AttendanceEntry[]>(this.apiUrl);
  }

  getEntryById(id: number): Observable<AttendanceEntry> {
    return this.http.get<AttendanceEntry>(`${this.apiUrl}/${id}`);
  }

  addEntry(id: number): Observable<AttendanceEntry> {
    return this.http.post<AttendanceEntry>(`${this.apiUrl}/${id}`, {});
  }

  updateEntry(entry: AttendanceEntry): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${entry.id}`, entry);
  }

  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}