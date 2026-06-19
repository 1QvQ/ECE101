import type { Note } from '../api/notes';

interface NoteCardProps {
    note: Note;
    onDelete: (id: string) => void;
    onEdit: (note: Note) => void;
}

export default function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
    // Prevent accidental clicks with a browser confirm modal
    const handleDeleteClick = () => {
        if (window.confirm(`Are you sure you want to delete the note "${note.title}"?`)) {
            onDelete(note.id);
        }
    };
    return (
        <div className="group relative p-6 bg-white border border-zinc-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-lg font-bold text-zinc-900 leading-snug">
                        {note.title}
                    </h3>

                    {!note.isPublic && (
                        <span className="shrink-0 bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium border border-amber-200/50">
                            Private
                        </span>
                    )}

                    {/* Edit Button (Shows on hover) */}
                    <button
                        onClick={() => onEdit(note)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-emerald-600 transition-all duration-200 p-1 rounded-md hover:bg-emerald-50"
                        aria-label="Edit Note"
                    >
                        {/* Minimalist SVG Pencil Icon */}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>

                    {/* Delete button - added button */}
                    <button
                        onClick={handleDeleteClick}
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all duration-200 p-1 rounded-md hover:bg-red-50"
                        aria-label="Delete Note">

                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                <p className="text-zinc-600 text-sm leading-relaxed mb-6 line-clamp-4">
                    {note.content}
                </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {note.tags?.map((tag) => (
                    <span
                        key={tag.id}
                        className="bg-zinc-100 text-zinc-700 text-xs px-2.5 py-1 rounded-lg font-medium border border-zinc-200/50"
                    >
                        #{tag.name}
                    </span>
                ))}
            </div>
        </div>
    );
}