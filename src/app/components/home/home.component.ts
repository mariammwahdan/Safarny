import { Component, HostListener } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import {MatDividerModule} from '@angular/material/divider';
import { CarouselModule } from 'ngx-owl-carousel-o'
import { OwlOptions } from 'ngx-owl-carousel-o'




@Component({
  selector: 'app-home',
  standalone: true,
  imports: [    
    CommonModule,
    SlickCarouselModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    CarouselModule
    
   
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isScrolled = false

  slides = [
    { img: "cairo.jpg", caption: "Pyramids of Giza" },
    { img: "Aswan.jpg", caption: "Nile River" },
    { img: "Alex.jpg", caption: "Alex" },
    { img: "luxor.jpg", caption: "Luxor Temple" },
    { img: "sharm.jpg", caption: "Sharm El Sheikh" },
    { img: "Alex.jpg", caption: "Alex" },
    { img: "Aswan.jpg", caption: "Aswan" },
    { img: "Hurgada.jpg", caption: "Hurgada" },

  ];

  
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 3000,
    dots: true,
    nav: false,
    margin: 10,
    responsive: {
      0:    { items: 1 },
      640:  { items: 2 },
      1024: { items: 4 }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50
  }

}
