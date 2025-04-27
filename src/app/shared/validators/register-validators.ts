import { Validators } from '@angular/forms';

const currentYear = new Date().getFullYear();


export const signupValidators = {
  firstname: [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(20),
  ],
  lastname: [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(20),
  ],
  phone: [
    Validators.required,
    Validators.pattern(/^(002|0)[0-9]{10}$/),
    Validators.minLength(11),
    Validators.maxLength(15),
  ],
  email: [Validators.required, Validators.email],
  password: [
    Validators.required,
    Validators.pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$/
    ),
  ],
  month: [Validators.required, Validators.min(1), Validators.max(12)],
  gender: [Validators.required],
  day: [Validators.required, Validators.min(1), Validators.max(31)],
  year: [
    Validators.required,
    Validators.min(1990),
    Validators.max(currentYear),
  ],
};
