export interface Document {
  id: number;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: number;
  uploadedDate: Date;
  isPublic: boolean;
  downloadUrl: string;
  tags: string[];
}

