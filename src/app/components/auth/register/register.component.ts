import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  myForm!: FormGroup;
  departments = ['IT', 'HR', 'Marketing', 'Finance', 'Operations', 'Sales'];
  roles = [
    { value: UserRole.EMPLOYEE, label: 'Employee' },
    { value: UserRole.MANAGER, label: 'Manager' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.myForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9._]+$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      role: new FormControl(UserRole.EMPLOYEE, [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }

  get myFc() {
    return this.myForm.controls;
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  validate(): void {
    if (this.myForm.valid) {
      const formValue = this.myForm.value;
      const userData = {
        username: formValue.username,
        email: formValue.email,
        password: formValue.password,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        role: formValue.role,
        department: formValue.department
      };

      this.authService.register(userData).subscribe({
        next: (result) => {
          if (result) {
            alert('Registration successful! Redirecting to dashboard...');
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 2000);
          } else {
            alert('Username or email already exists. Please try a different one.');
          }
        },
        error: (error) => {
          alert('An error occurred during registration. Please try again.');
        }
      });
    }
  }
}
