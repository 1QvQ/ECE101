import type { Note } from '../api/notes';

interface NoteCardProps {
    note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
    return (
        // Card container: Glassmorphism effect (semi-transparent bg + backdrop blur)
        <div className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">

            <div className="flex justify-between items-start mb-4">
                {/* Note title: Pure white for maximum readability */}
                <h3 className="text-xl font-bold text-white leading-tight drop-shadow-sm">
                    {note.title}
                </h3>

                {/* Privacy badge: Rendered only if the note is marked as private */}
                {!note.isPublic && (
                    <span className="bg-white/20 text-indigo-100 text-xs px-2 py-1 rounded-full font-medium border border-white/10">
                        Private
                    </span>
                )}
            </div>

            {/* Note content: Slightly dimmed text, truncated to 3 lines using line-clamp */}
            <p className="text-indigo-100/80 mb-6 line-clamp-3 leading-relaxed">
                {note.content}
            </p>

            {/* Tags container: Flexbox with wrap to handle multiple tags gracefully */}
            <div className="flex flex-wrap gap-2 mt-auto">
                {note.tags?.map((tag) => (
                    <span
                        key={tag.id}
                        className="bg-indigo-500/30 text-indigo-100 text-xs px-3 py-1.5 rounded-lg font-medium tracking-wide border border-indigo-400/30"
                    >
                        #{tag.name}
                    </span>
                ))}
            </div>
        </div>
    );
}