import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { DocumentService } from '../../../../services/document.service';
import { Document } from '../../../../models/document.model';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './document-form.component.html',
  styleUrl: './document-form.component.css'
})
export class DocumentFormComponent {
  documentForm: FormGroup;
  isEditMode = false;
  documentId: number | null = null;
  currentUser: any;
  selectedFile: File | null = null;
  filePreview: string = '';
  availableTags: string[] = ['handbook', 'policies', 'procedures', 'security', 'IT', 'guidelines', 'marketing', 'strategy', 'presentation', 'HR', 'update', 'template', 'project', 'timeline'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.documentForm = this.createForm();
    this.currentUser = this.authService.getCurrentUser();
    
    // Employees can only upload public documents
    if (this.isEmployee) {
      this.documentForm.patchValue({ isPublic: true });
    }
    
    this.checkEditMode();
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      fileName: ['', Validators.required],
      fileSize: [0, Validators.required],
      fileType: ['', Validators.required],
      isPublic: [true, Validators.required],
      tags: ['', Validators.required],
      downloadUrl: ['/assets/documents/', Validators.required]
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.documentId = +id;
      this.loadDocument();
    }
  }

  loadDocument(): void {
    if (this.documentId) {
      const document = this.documentService.getDocumentById(this.documentId);
      if (document && (this.isManager || document.uploadedBy === this.currentUser.id)) {
        this.documentForm.patchValue({
          title: document.title,
          description: document.description,
          fileName: document.fileName,
          fileSize: document.fileSize,
          fileType: document.fileType,
          isPublic: document.isPublic,
          tags: document.tags.join(', '),
          downloadUrl: document.downloadUrl
        });
        this.filePreview = document.fileName;
      } else {
        this.router.navigate(['/dashboard/documents']);
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.filePreview = file.name;
      
      // Update form with file information
      this.documentForm.patchValue({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        downloadUrl: `/assets/documents/${file.name}`
      });
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.filePreview = '';
    this.documentForm.patchValue({
      fileName: '',
      fileSize: 0,
      fileType: '',
      downloadUrl: '/assets/documents/'
    });
  }

  formatFileSize(bytes: number): string {
    return this.documentService.formatFileSize(bytes);
  }

  getFileIcon(fileType: string): string {
    if (fileType.includes('pdf')) return 'fas fa-file-pdf text-danger';
    if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word text-primary';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'fas fa-file-excel text-success';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'fas fa-file-powerpoint text-warning';
    if (fileType.includes('image')) return 'fas fa-file-image text-info';
    return 'fas fa-file text-secondary';
  }

  onSubmit(): void {
    if (this.documentForm.valid) {
      const formValue = this.documentForm.value;
      
      // Parse tags from comma-separated string
      const tags = formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
      
      const documentData = {
        title: formValue.title,
        description: formValue.description,
        fileName: formValue.fileName,
        fileSize: formValue.fileSize,
        fileType: formValue.fileType,
        uploadedBy: this.currentUser.id,
        isPublic: formValue.isPublic,
        downloadUrl: formValue.downloadUrl,
        tags: tags
      };

      if (this.isEditMode && this.documentId) {
        this.documentService.updateDocument(this.documentId, documentData);
      } else {
        this.documentService.uploadDocument(documentData);
      }
      
      this.router.navigate(['/dashboard/documents']);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/documents']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.documentForm.controls).forEach(key => {
      const control = this.documentForm.get(key);
      control?.markAsTouched();
    });
  }

  get isManager(): boolean {
    return this.authService.isManager();
  }

  get isEmployee(): boolean {
    return this.authService.isEmployee();
  }
}
