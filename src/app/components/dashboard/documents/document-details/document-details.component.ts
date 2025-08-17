import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { DocumentService } from '../../../../services/document.service';
import { Document } from '../../../../models/document.model';
import { UserRole } from '../../../../models/user.model';

@Component({
  selector: 'app-document-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.css']
})
export class DocumentDetailsComponent implements OnInit {
  document: Document | undefined;
  currentUser: any;

  constructor(
    public authService: AuthService,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDocumentDetails();
  }

  loadDocumentDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.documentService.getDocumentById(+id).subscribe({
        next: (doc) => {
          this.document = doc;
          if (!this.document || !this.canView()) {
            this.router.navigate(['/dashboard/documents']);
          }
        }
      });
    }
  }

  downloadDocument(): void {
    if (this.document) {
      // Simulate download - in real app, this would trigger actual file download
      alert(`Downloading: ${this.document.fileName}`);
    }
  }

  deleteDocument(): void {
    if (this.document && confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(this.document.id).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/dashboard/documents']);
          }
        }
      });
    }
  }

  canView(): boolean {
    return this.document !== undefined && (
      this.isManager || 
      this.document.isPublic || 
      this.document.uploadedBy === this.currentUser.id
    );
  }

  canEdit(): boolean {
    return this.document !== undefined && (
      this.isManager || 
      this.document.uploadedBy === this.currentUser.id
    );
  }

  canDelete(): boolean {
    return this.document !== undefined && (
      this.isManager || 
      this.document.uploadedBy === this.currentUser.id
    );
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  getFileTypeName(fileType: string): string {
    if (fileType.includes('pdf')) return 'PDF Document';
    if (fileType.includes('word') || fileType.includes('document')) return 'Word Document';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'Excel Spreadsheet';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'PowerPoint Presentation';
    if (fileType.includes('image')) return 'Image File';
    return 'Document';
  }

  getUploaderName(uploadedBy: number): string {
    this.authService.getUserById(uploadedBy).subscribe({
      next: (user) => {
        if (user) {
          return `${user.firstName} ${user.lastName}`;
        }
        return 'Unknown';
      }
    });
    return 'Loading...';
  }

  get isManager(): boolean {
    return this.currentUser?.role === UserRole.MANAGER;
  }

  get isEmployee(): boolean {
    return this.currentUser?.role === UserRole.EMPLOYEE;
  }
}
