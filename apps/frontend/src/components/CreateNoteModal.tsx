import { useState, useEffect } from 'react';
import { notesApi } from '../api/notes';
import type { Note } from '../api/notes';

interface CreateNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    // Optional prop to pass in the note we want to edit
    editingNote?: Note | null;
}

export default function CreateNoteModal({ isOpen, onClose, onSuccess, editingNote }: CreateNoteModalProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsString, setTagsString] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-fill the form when a note is passed in for editing
    useEffect(() => {
        if (editingNote) {
            setTitle(editingNote.title);
            setContent(editingNote.content);
            setIsPublic(editingNote.isPublic);
            // Convert the tags array back into a comma-separated string for the input field
            const tags = editingNote.tags?.map(t => t.name).join(', ') || '';
            setTagsString(tags);
        } else {
            // Reset form if we are creating a NEW note
            setTitle('');
            setContent('');
            setTagsString('');
            setIsPublic(false);
        }
    }, [editingNote, isOpen]); // Runs whenever the modal opens or the selected note changes

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            const payload = { title, content, isPublic, tags: tagsArray };

            // Smart routing based on whether we are editing or creating
            if (editingNote) {
                await notesApi.updateNote(editingNote.id, payload);
            } else {
                await notesApi.createNote(payload);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save note:', error);
            alert('Failed to save. Check console for details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determine UI text based on the mode
    const modalTitle = editingNote ? 'Edit Inspiration' : 'Record New Inspiration';
    const buttonText = editingNote ? (isSubmitting ? 'Updating...' : 'Save Changes') : (isSubmitting ? 'Posting...' : 'Post Inspiration');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-lg p-8 bg-white rounded-2xl shadow-2xl border border-zinc-200">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6 tracking-tight">
                    {modalTitle}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-800 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm"
                            placeholder="E.g., 2026 Tech Trends"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-800 mb-1">Content</label>
                        <textarea
                            required
                            rows={5}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm resize-none"
                            placeholder="Capture your thoughts here..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-800 mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={tagsString}
                            onChange={(e) => setTagsString(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm"
                            placeholder="E.g., ideas, planning, goals"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 bg-zinc-50 border-zinc-300 rounded focus:ring-emerald-600"
                        />
                        <label htmlFor="isPublic" className="ml-2 text-sm font-medium text-zinc-700">
                            Make this note public
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-zinc-600 bg-transparent border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-700 rounded-xl hover:bg-emerald-800 focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1 transition-all disabled:opacity-50"
                        >
                            {buttonText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}