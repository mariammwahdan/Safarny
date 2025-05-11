import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

interface TeamMember {
  name: string;
  title: string;
  photo: string;
  gender: 'female' | 'male';
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    RouterModule,
    CarouselModule
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit {
  // Animation properties for scroll reveal effect
  isVisible = false;
  
  // Team members data
  teamMembers: TeamMember[] = [
    {
      name: 'Mariam Wahdan',
      title: 'Founder & CEO',
      photo: 'team-photo-1',
      gender: 'female'
    },
    {
      name: 'Salma Elsoly',
      title: 'Head of Operations',
      photo: 'team-photo-2',
      gender: 'female'
    },
    {
      name: 'Donia Ahmed',
      title: 'Customer Experience Director',
      photo: 'team-photo-3',
      gender: 'female'
    },
    {
      name: 'Mustafa Usama',
      title: 'Technology Lead',
      photo: 'team-photo-4',
      gender: 'male'
    },
    {
      name: 'Ahmed Nabieh',
      title: 'Marketing Manager',
      photo: 'team-photo-5',
      gender: 'male'
    },
    {
      name: 'Mina George',
      title: 'Finance Director',
      photo: 'team-photo-6',
      gender: 'male'
    }
  ];

  // Owl Carousel Options
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    dots: true,
    nav: true,
    navSpeed: 700,
    navText: ['<span class="nav-arrow">&#10094;</span>', '<span class="nav-arrow">&#10095;</span>'],
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  };

  ngOnInit() {
    // Add scroll observer to trigger animations
    this.addScrollObserver();
  }

  addScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });

    // Observe all elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });
  }
}
