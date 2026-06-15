import { useEffect, useState, useCallback } from 'react';
import type { Note } from '../api/notes';
import { notesApi } from '../api/notes';
import NoteCard from '../components/NoteCard';
import CreateNoteModal from '../components/CreateNoteModal';

export default function Dashboard() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    // Extracted as a standalone function for initialization and post-creation refresh
    const fetchNotes = useCallback(async () => {
        try {
            const data = await notesApi.getAllNotes();
            setNotes(data);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        }
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return (
        <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-12 text-slate-100 relative">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                        Matariki Inspiration Vault
                    </h1>
                    <p className="text-indigo-200 mt-2 opacity-80">
                        Capture your thoughts amidst the shifting stars.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </div>
            </div>

            {/* Floating Action Button (FAB) - Bottom right corner */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-10 right-10 flex items-center justify-center w-14 h-14 bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 hover:scale-110 hover:-translate-y-1 transition-all duration-300 z-40"
                aria-label="Create New Note"
            >
                {/* Minimalist SVG "+" icon */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {/* Mount the modal component */}
            <CreateNoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchNotes} // Automatically trigger data refetch upon successful creation
            />
        </div>
    );
}