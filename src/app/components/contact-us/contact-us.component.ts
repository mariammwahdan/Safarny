import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';


@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [NavbarComponent , FooterComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {

  fields: string[] = ['name', 'email', 'contact', 'message'];
  hasError: boolean = false;

 
  submitForm(event: Event) {
    event.preventDefault();
    this.hasError = false; 

    this.fields.forEach((id: string) => {
      const input = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
      const error = document.getElementById(`${id}-error`) as HTMLParagraphElement;
      const value = input?.value?.trim() ?? '';

      if (!input || !error) {
        console.warn(`Missing input or error element for ID: ${id}`);
        return;
      }

      input.classList.remove('border-red-500'); 
      error.classList.add('hidden');

      if (value === '') {
        input.classList.add('border-red-500'); 
        error.textContent = `${this.capitalize(id)} is required`;
        error.classList.remove('hidden');
        this.hasError = true;
      }

      if (id === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          input.classList.add('border-red-500');
          error.textContent = 'Please enter a valid email address';
          error.classList.remove('hidden');
          this.hasError = true;
        }
      }

      if (id === 'name' && /\d/.test(value)) {
        input.classList.add('border-red-500');
        error.textContent = 'Name must not contain numbers';
        error.classList.remove('hidden');
        this.hasError = true;
      }

      if (id === 'name' && /[;,!?]/.test(value)) {
        input.classList.add('border-red-500');
        error.textContent = 'Name must not contain ; , ! or ?';
        error.classList.remove('hidden');
        this.hasError = true;
      }

      if (id === 'contact' && value !== '') {
        if (value.length < 10 || !/^\+?[0-9\s\-]+$/.test(value)) {
          input.classList.add('border-red-500');
          error.textContent = 'Please enter a valid phone number';
          error.classList.remove('hidden');
          this.hasError = true;
        }
      }
    });

  
    if (!this.hasError) {
      document.getElementById('thankYouPopup')?.classList.remove('hidden');
    }

    
  }


  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  clearError(id: string): void {
    const input = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
    const error = document.getElementById(`${id}-error`) as HTMLParagraphElement;
    input.classList.remove('border-red-500');
    error.classList.add('hidden');
  }
  
  resetFormAndClosePopup(): void {
    // hide popup
    document.getElementById('thankYouPopup')?.classList.add('hidden')
  
    // clear each field value
    this.fields.forEach(id => {
      const input = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement
      if (input) input.value = ''
    })
  
    // clear error styles
    this.fields.forEach(id => {
      const input = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement
      const error = document.getElementById(`${id}-error`)
      if (input) input.classList.remove('border-red-500')
      if (error) error.classList.add('hidden')
    })
  
    this.hasError = false
  }
  
  

}
