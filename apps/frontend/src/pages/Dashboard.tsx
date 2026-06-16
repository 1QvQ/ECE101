import { useEffect, useState, useCallback, useMemo } from 'react';
import type { Note } from '../api/notes';
import { notesApi } from '../api/notes';
import NoteCard from '../components/NoteCard';
import CreateNoteModal from '../components/CreateNoteModal';

export default function Dashboard() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

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

    // Handle delete action
    const handleNoteDelete = async (id: string) => {
        try {
            await notesApi.deleteNote(id);
            fetchNotes();
        } catch (error) {
            console.log("Failed to delete note:", error);
            alert("Failed to delete note");
        }
    };

    const handleEditNote = (note: Note) => {
        setEditingNote(note);
        setIsModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    };

    // Filter notes based on search query and selected tag
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            const matchesSearch = searchQuery === '' ||
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTag = !selectedTag ||
                note.tags?.some(tag => tag.name === selectedTag);

            return matchesSearch && matchesTag;
        });
    }, [notes, searchQuery, selectedTag]);

    // Compute metrics
    const stats = useMemo(() => {
        const total = notes.length;
        const publicCount = notes.filter(n => n.isPublic).length;
        const privateCount = total - publicCount;
        return { total, publicCount, privateCount };
    }, [notes]);

    // Extract unique tags and compute count
    const uniqueTags = useMemo(() => {
        const tagMap: Record<string, number> = {};
        notes.forEach(note => {
            note.tags?.forEach(tag => {
                tagMap[tag.name] = (tagMap[tag.name] || 0) + 1;
            });
        });
        return Object.entries(tagMap).map(([name, count]) => ({ name, count }));
    }, [notes]);

    return (
        <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 font-sans pb-16 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-200 backdrop-blur-md bg-white/95">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-extrabold tracking-tight text-emerald-800">ECE101</span>
                        <div className="h-4 w-[1px] bg-zinc-200" />
                        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Inspiration Vault</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 active:scale-[0.98] transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            New Inspiration
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-zinc-600 hover:text-zinc-900 text-sm font-semibold rounded-xl border border-zinc-200 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200 active:scale-[0.98] transition-all"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Layout Grid */}
            <main className="max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                {/* Left Area - Notes Feed */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                            Inspiration Vault
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1.5 leading-relaxed">
                            Capture and reference pedagogical observations, transition ideas, and notes.
                        </p>
                    </div>

                    {/* Active Tag Indicator */}
                    {selectedTag && (
                        <div className="flex items-center gap-2.5 bg-emerald-50/50 border border-emerald-200/60 rounded-xl px-4 py-2 text-sm text-emerald-800">
                            <span>Filtering by tag: <strong className="font-semibold">#{selectedTag}</strong></span>
                            <button
                                onClick={() => setSelectedTag(null)}
                                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2"
                            >
                                Clear filter
                            </button>
                        </div>
                    )}

                    {filteredNotes.length === 0 ? (
                        <div className="bg-white border border-zinc-200 rounded-xl p-16 text-center shadow-sm">
                            <svg className="w-12 h-12 text-zinc-300 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            <h3 className="text-base font-semibold text-zinc-950">No notes found</h3>
                            <p className="text-zinc-500 text-sm mt-1">Try adjusting your filters or record a new inspiration above.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {filteredNotes.map((note) => (
                                <NoteCard key={note.id} note={note} onDelete={handleNoteDelete} onEdit={handleEditNote} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Area - Sidebar */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="lg:sticky lg:top-24 space-y-6">
                        {/* Search Filter widget */}
                        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-3">
                            <label className="block text-sm font-semibold text-zinc-800">
                                Search
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Filter by title or content..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all text-sm"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Tag index widget */}
                        {uniqueTags.length > 0 && (
                            <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-3">
                                <h3 className="text-sm font-semibold text-zinc-800">
                                    Filter by Tag
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {uniqueTags.map(tag => (
                                        <button
                                            key={tag.name}
                                            onClick={() => setSelectedTag(tag.name === selectedTag ? null : tag.name)}
                                            className={`text-xs px-2.5 py-1 rounded-lg font-medium border transition-all ${tag.name === selectedTag
                                                ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm'
                                                : 'bg-zinc-100 border-zinc-200/50 text-zinc-700 hover:bg-zinc-200'
                                                }`}
                                        >
                                            #{tag.name} ({tag.count})
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Vault Stats Overview widget */}
                        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-4">
                            <h3 className="text-sm font-semibold text-zinc-800">
                                Vault Overview
                            </h3>
                            <div className="grid grid-cols-3 gap-2.5 pt-1">
                                <div className="text-center p-2 bg-zinc-50 border border-zinc-100 rounded-lg">
                                    <div className="text-xl font-bold text-zinc-900">{stats.total}</div>
                                    <div className="text-[10px] font-semibold uppercase text-zinc-400 mt-0.5">Total</div>
                                </div>
                                <div className="text-center p-2 bg-zinc-50 border border-zinc-100 rounded-lg">
                                    <div className="text-xl font-bold text-emerald-800">{stats.publicCount}</div>
                                    <div className="text-[10px] font-semibold uppercase text-zinc-400 mt-0.5">Public</div>
                                </div>
                                <div className="text-center p-2 bg-zinc-50 border border-zinc-100 rounded-lg">
                                    <div className="text-xl font-bold text-amber-800">{stats.privateCount}</div>
                                    <div className="text-[10px] font-semibold uppercase text-zinc-400 mt-0.5">Private</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal component */}
            <CreateNoteModal
                isOpen={isModalOpen}
                // MODIFY onClose: Clear the editing state when closing so the next "New Note" is blank
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingNote(null);
                }}
                onSuccess={fetchNotes}
                // ADD THIS LINE: Pass the current note data to the modal
                editingNote={editingNote}
            />
        </div>
    );
}