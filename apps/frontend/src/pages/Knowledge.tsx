import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Note } from '../api/notes';
import { notesApi } from '../api/notes';
import NoteCard from '../components/NoteCard';
import CreateNoteModal from '../components/CreateNoteModal';
import Icon from '../components/Icon';

export default function Knowledge() {
  const [params, setParams] = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]); const [query, setQuery] = useState(''); const [tag, setTag] = useState<string | null>(null); const [editing, setEditing] = useState<Note | null>(null); const [open, setOpen] = useState(params.get('new') === '1'); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { try { setNotes(await notesApi.getAllNotes()); setError(''); } catch { setError('Your saved notes could not be loaded. Check that the API is running.'); } finally { setLoading(false); } }, []);
  useEffect(() => {
    notesApi.getAllNotes()
      .then((items) => { setNotes(items); setError(''); })
      .catch(() => setError('Your saved notes could not be loaded. Check that the API is running.'))
      .finally(() => setLoading(false));
  }, []);
  const tags = useMemo(() => Array.from(new Set(notes.flatMap((note) => note.tags?.map((item) => item.name) || []))), [notes]);
  const filtered = useMemo(() => notes.filter((note) => (!query || `${note.title} ${note.content}`.toLowerCase().includes(query.toLowerCase())) && (!tag || note.tags?.some((item) => item.name === tag))), [notes, query, tag]);
  const closeModal = () => { setOpen(false); setEditing(null); if (params.has('new')) { params.delete('new'); setParams(params, { replace: true }); } };
  const remove = async (id: string) => { try { await notesApi.deleteNote(id); setNotes((current) => current.filter((note) => note.id !== id)); } catch { setError('We couldn’t delete that note. Please try again.'); } };
  return <div className="page-stack"><section className="page-heading reveal"><div><h1>My knowledge</h1><p className="lede">Notes and observations in one place.</p></div><button className="button button-primary" type="button" onClick={() => setOpen(true)}><Icon name="plus" size={18} /> New note</button></section>
    <section className="knowledge-toolbar reveal reveal-delay-1"><label className="filter-search"><Icon name="search" size={19} /><input aria-label="Search notes" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your notes" /></label><div className="tag-filters"><button className={!tag ? 'is-active' : ''} onClick={() => setTag(null)}>All notes</button>{tags.map((item) => <button key={item} className={tag === item ? 'is-active' : ''} onClick={() => setTag(item)}>#{item}</button>)}</div></section>
    {error && <div className="inline-notice">{error}</div>}
    {loading ? <div className="notes-grid">{[1,2,3].map((item) => <div className="note-skeleton" key={item} />)}</div> : filtered.length ? <section className="notes-grid">{filtered.map((note) => <NoteCard key={note.id} note={note} onDelete={remove} onEdit={(value) => { setEditing(value); setOpen(true); }} />)}</section> : <div className="empty-state"><span className="feature-icon"><Icon name="book" /></span><h2>{notes.length ? 'No notes match that search' : 'Start your knowledge library'}</h2><p>{notes.length ? 'Try another word or clear the tag filter.' : 'Save an observation, workshop takeaway, or teaching idea.'}</p><button className="button button-primary" onClick={() => setOpen(true)}><Icon name="plus" size={17} /> Add your first note</button></div>}
    <CreateNoteModal isOpen={open} onClose={closeModal} onSuccess={load} editingNote={editing} />
  </div>;
}
