import { useEffect, useMemo, useState } from 'react';
import type { Activity } from '../types/activity';
import { createActivity, getActivities } from '../api/activities';
import { curatedActivities, type CuratedActivity } from '../data/library';
import Icon from '../components/Icon';

type DisplayActivity = CuratedActivity | (Activity & { duration?: string; tone?: 'fern' | 'clay' | 'sun' });

export default function Activities() {
  const [activities, setActivities] = useState<DisplayActivity[]>(curatedActivities);
  const [search, setSearch] = useState('');
  const [age, setAge] = useState('All ages');
  const [selected, setSelected] = useState<DisplayActivity | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    getActivities().then((items) => {
      if (items.length) setActivities([...items, ...curatedActivities]);
    }).catch(() => undefined);
  }, []);

  const filtered = useMemo(() => activities.filter((activity) => {
    const haystack = `${activity.title} ${activity.description} ${activity.theme}`.toLowerCase();
    const matchesSearch = haystack.includes(search.toLowerCase());
    const matchesAge = age === 'All ages' || activity.ageGroup?.includes(age.replace(' years', ''));
    return matchesSearch && matchesAge;
  }), [activities, search, age]);

  return (
    <div className="page-stack">
      <section className="page-heading reveal">
        <div><h1>Activity ideas</h1><p className="lede">Practical ideas for your group.</p></div>
        <button className="button button-primary" type="button" onClick={() => setShowCreate(true)}><Icon name="plus" size={18} /> Add your own</button>
      </section>

      <section className="filter-bar reveal reveal-delay-1" aria-label="Filter activities">
        <label className="filter-search"><Icon name="search" size={19} /><input aria-label="Search activities" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search themes, materials, or ideas" /></label>
        <div className="segmented-control">
          {['All ages', '2-3 years', '3-5 years'].map((option) => <button key={option} className={age === option ? 'is-active' : ''} onClick={() => setAge(option)} type="button">{option}</button>)}
        </div>
      </section>

      {filtered.length ? (
        <section className="activity-grid" aria-live="polite">
          {filtered.map((activity, index) => (
            <article className={`activity-card tone-${activity.tone || (index % 2 ? 'clay' : 'fern')} reveal`} key={`${activity.id}-${index}`}>
              <div className="activity-visual" aria-hidden="true"><Icon name={index % 2 ? 'leaf' : 'spark'} size={44} weight="duotone" /></div>
              <div className="activity-body">
                <div className="tag-row"><span>{activity.theme || 'Classroom idea'}</span><span>{activity.ageGroup || 'All ages'}</span></div>
                <h2>{activity.title}</h2>
                <p>{activity.description || 'A teacher-created activity ready to adapt for your group.'}</p>
                <div className="card-footer"><span><Icon name="clock" size={16} /> {activity.duration || '20-30 min'}</span><button className="round-arrow" type="button" onClick={() => setSelected(activity)} aria-label={`Open ${activity.title}`}><Icon name="arrow" size={17} /></button></div>
              </div>
            </article>
          ))}
        </section>
      ) : <div className="empty-state"><span className="feature-icon"><Icon name="search" /></span><h2>No matching ideas</h2><p>Try a different theme or age group.</p></div>}

      {selected && <ActivityDetail activity={selected} onClose={() => setSelected(null)} />}
      {showCreate && <CreateActivity onClose={() => setShowCreate(false)} onCreated={(activity) => { setActivities((current) => [activity, ...current]); setShowCreate(false); }} />}
    </div>
  );
}

function ActivityDetail({ activity, onClose }: { activity: DisplayActivity; onClose: () => void }) {
  const materials = Array.isArray(activity.materials) ? activity.materials : [];
  const instructions = Array.isArray(activity.instructions) ? activity.instructions : [];
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="detail-sheet" role="dialog" aria-modal="true" aria-labelledby="activity-title" onMouseDown={(event) => event.stopPropagation()}>
    <button className="icon-button close-button" type="button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
    <p className="detail-meta">{activity.theme} · {activity.ageGroup}</p><h2 id="activity-title">{activity.title}</h2><p className="sheet-intro">{activity.description}</p>
    <div className="sheet-columns"><div><h3>What you’ll need</h3><ul className="check-list">{materials.map((item) => <li key={item}><Icon name="check" size={16} />{item}</li>)}</ul></div><div><h3>How to run it</h3><ol>{instructions.map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol></div></div>
    <button className="button button-primary" type="button" onClick={onClose}>Done <Icon name="check" size={17} /></button>
  </section></div>;
}

function CreateActivity({ onClose, onCreated }: { onClose: () => void; onCreated: (activity: DisplayActivity) => void }) {
  const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [theme, setTheme] = useState(''); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setSaving(true); setError(''); const payload = { title, description, theme, ageGroup: '3-5 years', materials: [], instructions: [] }; try { const created = await createActivity(payload); onCreated(created); } catch { setError('We couldn’t save this activity. Check that the API is running, then try again.'); } finally { setSaving(false); } };
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="form-sheet" role="dialog" aria-modal="true" aria-labelledby="create-activity-title" onMouseDown={(event) => event.stopPropagation()}><button className="icon-button close-button" onClick={onClose} type="button" aria-label="Close"><Icon name="close" /></button><h2 id="create-activity-title">Add an activity</h2>{error && <p className="form-error" role="alert">{error}</p>}<form onSubmit={submit} className="form-stack"><label>Title<input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Pebble story circle" /></label><label>Theme<input required value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="e.g. Storytelling" /></label><label>Description<textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What will the children explore?" /></label><div className="form-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : 'Save activity'}</button></div></form></section></div>;
}
