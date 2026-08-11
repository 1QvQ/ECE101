import { useState } from 'react';
import type { Note } from '../api/notes';
import Icon from './Icon';

interface NoteCardProps { note: Note; onDelete: (id: string) => void; onEdit: (note: Note) => void; }

export default function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
  const [confirming, setConfirming] = useState(false);
  return <article className="knowledge-card">
    <div className="note-topline"><span className="note-glyph"><Icon name="book" size={18} /></span><span>{note.isPublic ? <><Icon name="globe" size={14} /> Shared</> : <><Icon name="lock" size={14} /> Private</>}</span></div>
    <h2>{note.title}</h2><p>{note.content}</p>
    <div className="tag-row">{note.tags?.map((tag) => <span key={tag.id}>#{tag.name}</span>)}</div>
    <div className="note-actions">
      {confirming ? <div className="delete-confirm"><span>Delete this note?</span><button onClick={() => onDelete(note.id)}>Delete</button><button onClick={() => setConfirming(false)}>Keep it</button></div> : <><button type="button" onClick={() => onEdit(note)}><Icon name="edit" size={16} /> Edit</button><button type="button" className="danger-action" onClick={() => setConfirming(true)}><Icon name="trash" size={16} /> Delete</button></>}
    </div>
  </article>;
}
