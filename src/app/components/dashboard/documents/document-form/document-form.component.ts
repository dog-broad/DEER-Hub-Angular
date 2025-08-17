import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { DocumentService } from '../../../../services/document.service';
import { Document } from '../../../../models/document.model';
import { UserRole } from '../../../../models/user.model';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.css']
})
export class DocumentFormComponent {
  myForm!: FormGroup;
  currentUser: any;
  isEditMode = false;
  documentId: number | null = null;
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private documentService: DocumentService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.initForm();
  }

  get myFc() {
    return this.myForm.controls;
  }

  private initForm(): void {
    this.myForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      isPublic: new FormControl(true),
      tags: new FormControl('', [Validators.required])
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  validate(): void {
    if (this.myForm.valid && this.selectedFile) {
      const formValue = this.myForm.value;
      
      const documentData = {
        title: formValue.title,
        description: formValue.description,
        fileName: this.selectedFile.name,
        fileSize: this.selectedFile.size,
        fileType: this.selectedFile.type,
        uploadedBy: this.currentUser.id,
        isPublic: formValue.isPublic,
        downloadUrl: `/assets/documents/${this.selectedFile.name}`,
        tags: formValue.tags.split(',').map((tag: string) => tag.trim())
      };

      this.documentService.uploadDocument(documentData).subscribe({
        next: (result) => {
          alert('Document uploaded successfully!');
          this.router.navigate(['/dashboard/documents']);
        },
        error: (error) => {
          alert('An error occurred while uploading document');
        }
      });
    } else if (!this.selectedFile) {
      alert('Please select a file to upload');
    }
  }

  get isManager(): boolean {
    return this.currentUser?.role === UserRole.MANAGER;
  }
}
