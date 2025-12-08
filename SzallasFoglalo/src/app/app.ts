import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingComponent } from "../components/system/landing-page/landing-page.component";
import { FooterComponent } from "../components/system/footer/footer.component";
import { NavbarComponent } from "../components/system/navbar/navbar.component";
import { HeaderComponent } from '../components/system/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LandingComponent, FooterComponent, HeaderComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {
  protected readonly title = signal('SzallasFoglalo');
}
