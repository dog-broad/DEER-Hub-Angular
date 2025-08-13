import { Injectable } from '@angular/core';
import { Document } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [
    // Sample documents omitted for brevity
    {
      id: 1,
      title: 'Employee Handbook 2025',
      description: 'Complete employee handbook with company policies and procedures',
      fileName: 'employee-handbook-2025.pdf',
      fileSize: 2048576,
      fileType: 'application/pdf',
      uploadedBy: 2,
      uploadedDate: new Date('2025-06-15'),
      isPublic: true,
      downloadUrl: '/assets/documents/employee-handbook-2025.pdf',
      tags: ['handbook', 'policies', 'procedures']
    },
    {
      id: 2,
      title: 'IT Security Guidelines',
      description: 'Security best practices for IT department',
      fileName: 'it-security-guidelines.pdf',
      fileSize: 1048576,
      fileType: 'application/pdf',
      uploadedBy: 1,
      uploadedDate: new Date('2025-07-01'),
      isPublic: true,
      downloadUrl: '/assets/documents/it-security-guidelines.pdf',
      tags: ['security', 'IT', 'guidelines']
    },
    {
      id: 3,
      title: 'Marketing Strategy Q3 2025',
      description: 'Marketing strategy presentation for Q3 2025',
      fileName: 'marketing-strategy-q3-2025.pptx',
      fileSize: 5242880,
      fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      uploadedBy: 3,
      uploadedDate: new Date('2025-06-20'),
      isPublic: false,
      downloadUrl: '/assets/documents/marketing-strategy-q3-2025.pptx',
      tags: ['marketing', 'strategy', 'presentation']
    },
    {
      id: 4,
      title: 'HR Policies Update',
      description: 'Updated HR policies effective from August 2025',
      fileName: 'hr-policies-update.pdf',
      fileSize: 1536000,
      fileType: 'application/pdf',
      uploadedBy: 2,
      uploadedDate: new Date('2025-07-15'),
      isPublic: true,
      downloadUrl: '/assets/documents/hr-policies-update.pdf',
      tags: ['HR', 'policies', 'update']
    },
    {
      id: 5,
      title: 'Project Timeline Template',
      description: 'Excel template for project timeline management',
      fileName: 'project-timeline-template.xlsx',
      fileSize: 512000,
      fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      uploadedBy: 1,
      uploadedDate: new Date('2025-07-10'),
      isPublic: true,
      downloadUrl: '/assets/documents/project-timeline-template.xlsx',
      tags: ['template', 'project', 'timeline']
    }
  ];

  private nextId = 6;

  constructor() { }

  getAllDocuments(): Document[] {
    return [...this.documents];
  }

  getPublicDocuments(): Document[] {
    return this.documents.filter(doc => doc.isPublic);
  }

  getDocumentsByUser(userId: number): Document[] {
    return this.documents.filter(doc => doc.uploadedBy === userId);
  }

  getDocumentById(id: number): Document | undefined {
    return this.documents.find(doc => doc.id === id);
  }

  uploadDocument(document: Omit<Document, 'id' | 'uploadedDate'>): Document {
    const newDocument: Document = {
      ...document,
      id: this.nextId++,
      uploadedDate: new Date()
    };
    
    this.documents.push(newDocument);
    return newDocument;
  }

  updateDocument(id: number, updates: Partial<Document>): Document | null {
    const docIndex = this.documents.findIndex(doc => doc.id === id);
    
    if (docIndex !== -1) {
      this.documents[docIndex] = {
        ...this.documents[docIndex],
        ...updates
      };
      return this.documents[docIndex];
    }
    
    return null;
  }

  deleteDocument(id: number): boolean {
    const docIndex = this.documents.findIndex(doc => doc.id === id);
    
    if (docIndex !== -1) {
      this.documents.splice(docIndex, 1);
      return true;
    }
    
    return false;
  }

  searchDocuments(query: string): Document[] {
    const searchTerm = query.toLowerCase();
    return this.documents.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm) ||
      doc.description.toLowerCase().includes(searchTerm) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  getDocumentsByTag(tag: string): Document[] {
    return this.documents.filter(doc => 
      doc.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

