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
        // Fixed overlay covering the entire screen with a dark blur
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">

            {/* Glassmorphism Modal Container */}
            <div className="relative w-full max-w-lg p-8 bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">
                    Record New Inspiration
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="E.g., 2026 Tech Trends"
                        />
                    </div>

                    {/* Content Textarea */}
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Content</label>
                        <textarea
                            required
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            placeholder="Capture your thoughts here..."
                        />
                    </div>

                    {/* Tags Input */}
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={tagsString}
                            onChange={(e) => setTagsString(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="E.g., ideas, planning, goals"
                        />
                    </div>

                    {/* Privacy Toggle */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 bg-white/5 border-white/10 rounded focus:ring-indigo-500 focus:ring-offset-slate-800"
                        />
                        <label htmlFor="isPublic" className="ml-2 text-sm text-indigo-200">
                            Make this note public
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-indigo-200 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Posting...' : 'Post Inspiration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}