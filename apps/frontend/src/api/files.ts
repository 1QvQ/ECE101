import { apiClient } from './client';

export interface ProcessedFile {
  filename: string;
  totalChunks: number;
  chunks: string[];
}

export async function uploadDocument(file: File): Promise<ProcessedFile> {
  const body = new FormData();
  body.append('file', file);
  const { data } = await apiClient.post<ProcessedFile>('/files/upload', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
