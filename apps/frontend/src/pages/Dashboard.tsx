import { useEffect, useState } from 'react';
import type { Note } from '../api/notes'
import { notesApi } from '../api/notes'

export default function Dashboard() {
    const [notes, setNotes] = useState<Note[]>([]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const data = await notesApi.getAllNotes();
                console.log("Notes data: ", data);
                setNotes(data);
            } catch (error) {
                console.error("Failed to fetch notes: ", error);
            }
        }
        fetchNotes();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">My Knowledge Base</h1>
            <pre className="bg-gray-100 p-4 rounded mt-4">
                {JSON.stringify(notes, null, 2)}
            </pre>
        </div>
    );
}