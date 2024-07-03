import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, catchError } from 'rxjs';
export interface AttendanceEntry {
  id: number;
  employeeId: number;
  date: string;
  timeIn: string | '';
  timeOut: string | '';
  formattedTimeIn: string | '';
  formattedTimeOut: string | '';
  isEditing: boolean;
  formattedEntryDate: string | '';
  employeeName: string | '';
  timeInString: string | '';
  timeOutString: string | '';

  parsedTimeIn: {
    hour: number;
    minutes: string;
    period: string;
  };

  parsedTimeOut: {
    hour: number;
    minutes: string;
    period: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TimeManagementService {

  private apiUrl: string;

  private attendanceEntries: Array<{ date: string, timeIn: string, timeOut: string }> = [];

  constructor(private http: HttpClient) {
    this.apiUrl = environment.attendanceAPI;
  }

  updateEntries(entries: AttendanceEntry[]) {
    this.attendanceEntries = entries.map(entry => ({ ...entry, isEditing: false }));
  }

  getAllEntries(): Observable<AttendanceEntry[]> {
    return this.http.get<AttendanceEntry[]>(this.apiUrl);
  }
  getEntryById(id: number): Observable<AttendanceEntry> {
    return this.http.get<AttendanceEntry>(`${this.apiUrl}/${id}`);
  }

  getEntriesByEmployeeIdAsync(id: number): Observable<AttendanceEntry[]> {
    return this.http.get<AttendanceEntry[]>(`${this.apiUrl}/${id}/entries`);
  }

  addEntry(employeeId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${employeeId}`, {}).pipe(
      catchError(error => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  updateEntry(entry: AttendanceEntry): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${entry.id}`, entry);
  }

  timeOut(employeeId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/timeout`, employeeId);
  }

  deleteEntry(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}