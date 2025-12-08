import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingComponent } from "../components/system/landing-page/landing-page.component";
import { FooterComponent } from "../components/system/footer/footer.component";
import { NavbarComponent } from "../components/system/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LandingComponent, FooterComponent,NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App {
  protected readonly title = signal('SzallasFoglalo');
}
