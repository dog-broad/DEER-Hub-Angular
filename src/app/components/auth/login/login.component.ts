import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.myForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  get myFc() {
    return this.myForm.controls;
  }

  validate(): void {
    if (this.myForm.valid) {
      this.authService.login(this.myForm.value.username, this.myForm.value.password).subscribe({
        next: (user) => {
          if (user) {
            this.router.navigate(['/dashboard']);
          } else {
            alert('Invalid username or password');
          }
        },
        error: (error) => {
          alert('An error occurred during login');
        }
      });
    }
  }
}
