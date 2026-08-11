import { useState } from 'react';
import { notesApi, type Note } from '../api/notes';
import Icon from './Icon';

interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; editingNote?: Note | null; }

export default function CreateNoteModal({ isOpen, onClose, onSuccess, editingNote }: Props) {
  if (!isOpen) return null;
  return <NoteForm key={editingNote?.id || 'new'} onClose={onClose} onSuccess={onSuccess} editingNote={editingNote} />;
}

function NoteForm({ onClose, onSuccess, editingNote }: Omit<Props, 'isOpen'>) {
  const [title, setTitle] = useState(editingNote?.title || ''); const [content, setContent] = useState(editingNote?.content || ''); const [tags, setTags] = useState(editingNote?.tags?.map((tag) => tag.name).join(', ') || ''); const [isPublic, setIsPublic] = useState(editingNote?.isPublic || false); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); setError(''); const payload = { title: title.trim(), content: content.trim(), isPublic, tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean) }; try { if (editingNote) await notesApi.updateNote(editingNote.id, payload); else await notesApi.createNote(payload); await onSuccess(); onClose(); } catch { setError('We couldn’t save this note. Check your connection and try again.'); } finally { setSaving(false); } };
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="form-sheet" role="dialog" aria-modal="true" aria-labelledby="note-form-title" onMouseDown={(event) => event.stopPropagation()}><button className="icon-button close-button" type="button" onClick={onClose} aria-label="Close"><Icon name="close" /></button><h2 id="note-form-title">{editingNote ? 'Edit note' : 'Add a note'}</h2>{error && <div className="form-error" role="alert">{error}</div>}<form className="form-stack" onSubmit={submit}><label>Title<input autoFocus required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Water play observation" /></label><label>Note<textarea required rows={6} value={content} onChange={(e) => setContent(e.target.value)} placeholder="What would you like to remember?" /></label><label>Tags <small>separate with commas</small><input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="observation, sensory play" /></label><label className="check-field"><input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} /><span><strong>Share with other teachers</strong><small>Private notes are only visible to you.</small></span></label><div className="form-actions"><button className="button button-secondary" type="button" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : editingNote ? 'Save changes' : 'Save note'}</button></div></form></section></div>;
}
