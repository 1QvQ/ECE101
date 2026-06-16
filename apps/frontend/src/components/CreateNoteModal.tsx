import { useState } from 'react';
import { notesApi } from '../api/notes';

interface CreateNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    // This callback tells the Dashboard to refresh the list after a successful post
    onSuccess: () => void;
}

export default function CreateNoteModal({ isOpen, onClose, onSuccess }: CreateNoteModalProps) {
    // Form state management
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsString, setTagsString] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If modal is not open, render nothing
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        setIsSubmitting(true);

        try {
            // Convert comma-separated string into an array of strings
            const tagsArray = tagsString
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '');

            // Call our API service
            await notesApi.createNote({
                title,
                content,
                isPublic,
                tags: tagsArray,
            });

            // Clear the form
            setTitle('');
            setContent('');
            setTagsString('');
            setIsPublic(false);

            // Close modal and trigger data refresh in Dashboard
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to create note:', error);
            alert('Failed to post. Check console for details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
            <div className="relative w-full max-w-lg p-8 bg-white border border-zinc-200 rounded-2xl shadow-2xl">
                <h2 className="text-2xl font-bold text-zinc-900 mb-6 tracking-tight">
                    Record New Inspiration
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-800 mb-1.5">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all sm:text-sm"
                            placeholder="E.g., 2026 Tech Trends"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-800 mb-1.5">Content</label>
                        <textarea
                            required
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all resize-none sm:text-sm"
                            placeholder="Capture your thoughts here..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-800 mb-1.5">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={tagsString}
                            onChange={(e) => setTagsString(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all sm:text-sm"
                            placeholder="E.g., ideas, planning, goals"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="w-4 h-4 text-emerald-700 bg-zinc-50 border-zinc-200 rounded focus:ring-emerald-600 focus:ring-offset-2 focus:ring-offset-white"
                        />
                        <label htmlFor="isPublic" className="ml-2.5 text-sm font-medium text-zinc-700 select-none">
                            Make this note public
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-zinc-600 bg-transparent border border-zinc-200 rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-700 rounded-xl hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Posting...' : 'Post Inspiration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}