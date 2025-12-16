import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import huLocale from '@fullcalendar/core/locales/hu';
import { ApiService } from '../../../services/api';

interface Booking {
  id: number;
  userId: number;
  accommodationId: number;
  startDate: string;
  endDate: string;
  persons: number;
  totalPrice: number;
  status: number;
  createdAt: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: huLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    buttonText: {
      today: 'Ma',
      month: 'Hónap',
      week: 'Hét'
    },
    height: 'auto',
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventContent: this.renderEventContent.bind(this)
  };

  bookings: Booking[] = [];
  loading: boolean = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadBookings();
  }

  async loadBookings() {
    try {
      this.loading = true;
      const response = await this.api.selectAll('bookings');
      
      if (response.status === 200 && response.data) {
        this.bookings = response.data;
        this.updateCalendarEvents();
      }
    } catch (error) {
      console.error('Hiba a foglalások betöltésekor:', error);
    } finally {
      this.loading = false;
    }
  }

  updateCalendarEvents() {
    const events = this.bookings.map(booking => {
      // Szín a státusz alapján
      let backgroundColor = '#10b981'; // zöld - aktív
      let borderColor = '#059669';
      
      if (booking.status === 0) {
        backgroundColor = '#f59e0b'; // sárga - függőben
        borderColor = '#d97706';
      } else if (booking.status === 2) {
        backgroundColor = '#ef4444'; // piros - törölve
        borderColor = '#dc2626';
      }

      return {
        id: booking.id.toString(),
        title: `Foglalás #${booking.id}`,
        start: booking.startDate,
        end: this.addDays(booking.endDate, 1), // FullCalendar exclusive end date
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        extendedProps: {
          bookingId: booking.id,
          persons: booking.persons,
          totalPrice: booking.totalPrice,
          status: booking.status,
          accommodationId: booking.accommodationId
        }
      };
    });

    this.calendarOptions.events = events;
  }

  addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  handleEventClick(clickInfo: any) {
    const booking = clickInfo.event.extendedProps;
    const statusText = this.getStatusText(booking.status);
    
    alert(`
      Foglalás részletei:
      
      Foglalás ID: ${booking.bookingId}
      Személyek száma: ${booking.persons}
      Teljes ár: ${booking.totalPrice.toLocaleString('hu-HU')} Ft
      Státusz: ${statusText}
      
      Kezdő dátum: ${clickInfo.event.start.toLocaleDateString('hu-HU')}
      Záró dátum: ${new Date(clickInfo.event.end.getTime() - 86400000).toLocaleDateString('hu-HU')}
    `);
  }

  renderEventContent(eventInfo: any) {
    const persons = eventInfo.event.extendedProps.persons;
    return {
      html: `
        <div class="fc-event-main-frame">
          <div class="fc-event-title-container">
            <div class="fc-event-title">${eventInfo.event.title}</div>
          </div>
          <div class="fc-event-persons">👥 ${persons} fő</div>
        </div>
      `
    };
  }

  getStatusText(status: number): string {
    switch(status) {
      case 0: return 'Függőben';
      case 1: return 'Megerősítve';
      case 2: return 'Törölve';
      default: return 'Ismeretlen';
    }
  }
}