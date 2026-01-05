import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  sendEmail(template: string, to: string, subject: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sendmail`, {
      template,
      to,
      subject,
      data
    });
  }
}