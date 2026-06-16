import type { Note } from '../api/notes';

interface NoteCardProps {
    note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
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