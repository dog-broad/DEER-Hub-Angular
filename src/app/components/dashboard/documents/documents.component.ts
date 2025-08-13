import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { DocumentService } from '../../../services/document.service';
import { Document } from '../../../models/document.model';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent {
  documents: Document[] = [];
  filteredDocuments: Document[] = [];
  currentUser: any;
  searchTerm: string = '';

  constructor(
    public authService: AuthService,
    private documentService: DocumentService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDocuments();
  }

  loadDocuments(): void {
    if (this.authService.isManager()) {
      this.documents = this.documentService.getAllDocuments();
    } else {
      // Employees see public documents and their own documents
      const publicDocs = this.documentService.getPublicDocuments();
      const userDocs = this.documentService.getDocumentsByUser(this.currentUser.id);
      this.documents = [...publicDocs, ...userDocs.filter(doc => !doc.isPublic)];
    }
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredDocuments = this.documents.filter(document => {
      const searchMatch = !this.searchTerm || 
        document.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        document.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return searchMatch;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  deleteDocument(documentId: number): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(documentId);
      this.loadDocuments();
    }
  }

  downloadDocument(document: Document): void {
    // Simulate download - in real app, this would trigger actual file download
    alert(`Downloading: ${document.fileName}`);
  }

  get isManager(): boolean {
    return this.authService.isManager();
  }

  get isEmployee(): boolean {
    return this.authService.isEmployee();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }



  canEdit(document: Document): boolean {
    return this.isManager || document.uploadedBy === this.currentUser.id;
  }

  canDelete(document: Document): boolean {
    return this.isManager || document.uploadedBy === this.currentUser.id;
  }

  canView(document: Document): boolean {
    return this.isManager || document.isPublic || document.uploadedBy === this.currentUser.id;
  }

  getUploaderName(uploadedBy: number): string {
    const user = this.authService.getUserById(uploadedBy);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown';
  }
}
