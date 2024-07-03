import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  extractDateFromApiDateString(apiDateString: string): string {
    return apiDateString.split('T')[0];
  }

  compareDates(apiDateString: string): boolean {
    const apiDate = this.extractDateFromApiDateString(apiDateString);
    const currentDate = this.formatDateToYYYYMMDD(new Date());
    return apiDate === currentDate;
  }

  parseTime(timeString: string): { hour: number, minutes: string, period: string } {
    const timeParts = timeString.split(/[:\s]/);
    const hour = parseInt(timeParts[0], 10);
    const minutes = timeParts[1].padStart(2, '0');
    const period = timeParts[2] ? timeParts[2].toUpperCase() : '';
    return { hour, minutes, period };
  }
}
