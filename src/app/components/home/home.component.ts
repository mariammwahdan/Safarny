import { Component, HostListener } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import {MatDividerModule} from '@angular/material/divider';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [    
    CommonModule,
    SlickCarouselModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
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
    { img: "Aswan.jpg", caption: "Nile River" },

  ];

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 3,
    dots: true,          
    infinite: true,
    autoplay: true,
    draggable: true,
  touchMove: true,
    responsive: [
      {
        breakpoint: 1024, 
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50
  }

}
