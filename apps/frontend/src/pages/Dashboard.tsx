import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Note } from '../api/notes';
import { notesApi } from '../api/notes';
import { curatedActivities, upcomingMoments } from '../data/library';
import Icon from '../components/Icon';

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    notesApi.getAllNotes().then(setNotes).catch(() => setNotes([]));
  }, []);

  const today = useMemo(() => new Intl.DateTimeFormat('en-NZ', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date()), []);

  const dailyIdea = curatedActivities[0];

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) navigate(`/documents?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="page-stack dashboard-page">
      <section className="welcome-row reveal">
        <div>
          <p className="date-line">{today}</p>
          <h1>Kia ora.</h1>
        </div>
        <Link to="/knowledge?new=1" className="button button-secondary">
          <Icon name="plus" size={18} /> Add a note
        </Link>
      </section>

      <section className="ask-panel reveal reveal-delay-1" aria-labelledby="ask-heading">
        <div className="ask-copy">
          <span className="feature-icon"><Icon name="spark" size={21} /></span>
          <h2 id="ask-heading">Search your knowledge</h2>
        </div>
        <form className="search-composer" onSubmit={handleSearch}>
          <Icon name="search" size={21} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask about MoE guidance, centre policy, or your notes…"
            aria-label="Search teaching knowledge"
          />
          <button type="submit" aria-label="Search" disabled={!query.trim()}><Icon name="arrow" size={19} /></button>
        </form>
      </section>

      <div className="dashboard-grid">
        <section className="daily-card reveal reveal-delay-2" aria-labelledby="daily-heading">
          <div className="section-heading-row">
            <div>
              <h2 id="daily-heading">{dailyIdea.title}</h2>
            </div>
            <span className="feature-icon"><Icon name="spark" size={22} weight="fill" /></span>
          </div>
          <p className="daily-description">{dailyIdea.description}</p>
          <div className="meta-row">
            <span><Icon name="clock" size={16} /> {dailyIdea.duration}</span>
            <span>{dailyIdea.ageGroup}</span>
            <span>{dailyIdea.theme}</span>
          </div>
          <div className="material-strip">
            <small>Bring</small>
            <div>{dailyIdea.materials.map((material) => <span key={material}>{material}</span>)}</div>
          </div>
          <Link className="text-link" to={`/activities?idea=${dailyIdea.id}`}>View the full activity <Icon name="arrow" size={16} /></Link>
        </section>

        <aside className="upcoming-panel reveal reveal-delay-3" aria-labelledby="upcoming-heading">
          <div className="section-heading-row compact">
            <div>
              <h2 id="upcoming-heading">Coming up</h2>
            </div>
            <Icon name="calendar" size={21} />
          </div>
          <div className="moment-list">
            {upcomingMoments.map((moment) => (
              <article className="moment" key={moment.title}>
                <time><strong>{moment.day}</strong><span>{moment.month}</span></time>
                <div><h3>{moment.title}</h3><p>{moment.note}</p></div>
              </article>
            ))}
          </div>
          <Link className="text-link" to="/activities">Plan your next activity <Icon name="arrow" size={16} /></Link>
        </aside>
      </div>

      <section className="recents-section reveal reveal-delay-3" aria-labelledby="recent-heading">
        <div className="section-heading-row">
          <div>
            <h2 id="recent-heading">Pick up where you left off</h2>
          </div>
          <Link to="/knowledge" className="text-link">View all <Icon name="arrow" size={16} /></Link>
        </div>
        <div className="recent-grid">
          {(notes.length ? notes.slice(0, 3) : [
            { id: 'sample-1', title: 'Water play observations', content: 'Children negotiated turns and compared the capacity of different vessels.', isPublic: false, createdAt: '', tags: [{ id: '1', name: 'observation' }] },
            { id: 'sample-2', title: 'Whānau night ideas', content: 'Invite families to contribute a favourite song, story or shared kai.', isPublic: true, createdAt: '', tags: [{ id: '2', name: 'whānau' }] },
            { id: 'sample-3', title: 'Transition support', content: 'A visual first-then card and familiar song helped make pack-away time predictable.', isPublic: false, createdAt: '', tags: [{ id: '3', name: 'wellbeing' }] },
          ]).map((note) => (
            <article className="recent-note" key={note.id}>
              <div className="note-topline">
                <span className="note-glyph"><Icon name="book" size={18} /></span>
                <span>{note.isPublic ? 'Shared' : 'Private note'}</span>
              </div>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div className="tag-row">{note.tags?.slice(0, 2).map((tag) => <span key={tag.id}>#{tag.name}</span>)}</div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
