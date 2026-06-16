import { apiClient } from './client';



export interface Tag {
    id: number;
    name: string;
}
// need to fix tags to be array of strings
export interface Note {
    id: string;
    title: string;
    content: string;
    isPublic: boolean;
    creatAt: string;
    tags: Tag[];
}

export interface CreateNotePayload {
    title: string,
    content: string,
    isPublic?: boolean,
    tags?: string[],
}
// Encapsulate note calls within an object
export const notesApi = {
    getAllNotes: async (): Promise<Note[]> => {
        //Fetch all notes
        const response = await apiClient.get('/notes');
        return response.data;
    },

    // Create new notes
    createNote: async (data: CreateNotePayload): Promise<Note[]> => {
        const response = await apiClient.post('/notes', data);
        return response.data;
    },

    // Delete notes
    deleteNote: async (id: string): Promise<void> => {
        const response = await apiClient.delete(`/notes/${id}`);
        return response.data;
    },
};