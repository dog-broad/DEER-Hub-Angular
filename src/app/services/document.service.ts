import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Document } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/documents`);
  }

  getPublicDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/documents`).pipe(
      map(documents => documents.filter(doc => doc.isPublic))
    );
  }

  getDocumentsByUser(userId: number): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/documents`).pipe(
      map(documents => documents.filter(doc => doc.uploadedBy === userId))
    );
  }

  getDocumentById(id: number): Observable<Document | undefined> {
    return this.http.get<Document>(`${this.apiUrl}/documents/${id}`);
  }

  uploadDocument(document: Omit<Document, 'id' | 'uploadedDate'>): Observable<Document> {
    return this.http.get<Document[]>(`${this.apiUrl}/documents`).pipe(
      switchMap(documents => {
        const newDocument: Document = {
          ...document,
          id: this.getNextId(documents),
          uploadedDate: new Date()
        };
        return this.http.post<Document>(`${this.apiUrl}/documents`, newDocument);
      })
    );
  }

  updateDocument(id: number, updates: Partial<Document>): Observable<Document | null> {
    return this.http.patch<Document>(`${this.apiUrl}/documents/${id}`, updates);
  }

  deleteDocument(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/documents/${id}`).pipe(
      map(() => true)
    );
  }

  searchDocuments(query: string): Observable<Document[]> {
    const searchTerm = query.toLowerCase();
    return this.http.get<Document[]>(`${this.apiUrl}/documents`).pipe(
      map(documents => documents.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm) ||
        doc.description.toLowerCase().includes(searchTerm) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ))
    );
  }

  getDocumentsByTag(tag: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/documents`).pipe(
      map(documents => documents.filter(doc => 
        doc.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      ))
    );
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private getNextId(documents: Document[]): number {
    return Math.max(...documents.map(d => d.id), 0) + 1;
  }
}

