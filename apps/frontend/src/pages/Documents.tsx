import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { uploadDocument } from '../api/files';
import { sampleDocuments } from '../data/library';
import Icon from '../components/Icon';

const answer = {
  summary: 'For centre-based services, indoor and outdoor space requirements are calculated from the number and ages of children attending. Your service should check Schedule 4 of the Education (Early Childhood Services) Regulations and the current licensing criteria before changing room capacity.',
  points: ['Use usable activity space, excluding passageways and fixed storage.', 'Check whether children under two share the space.', 'Record any approved exemptions with the centre’s licence documents.'],
};

export default function Documents() {
  const [params] = useSearchParams();
  const initialQuery = params.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(Boolean(initialQuery));
  const [documents, setDocuments] = useState(sampleDocuments);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const filteredDocs = useMemo(() => documents.filter((doc) => `${doc.title} ${doc.source} ${doc.category}`.toLowerCase().includes(query.toLowerCase())), [documents, query]);

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!/\.(pdf|docx)$/i.test(file.name)) { setNotice('Choose a PDF or DOCX file.'); return; }
    setUploading(true); setNotice('');
    try {
      const result = await uploadDocument(file);
      setDocuments((current) => [{ id: `upload-${Date.now()}`, title: result.filename, source: 'Koru Early Learning', type: file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX', updated: `Added today · ${result.totalChunks} searchable sections`, category: 'Centre document' }, ...current]);
      setNotice(`${result.filename} is ready to search.`);
    } catch { setNotice('The document could not be uploaded. Check that the API is running, then try again.'); }
    finally { setUploading(false); if (fileInput.current) fileInput.current.value = ''; }
  };

  return <div className="page-stack"><section className="page-heading reveal"><div><h1>Documents</h1><p className="lede">Search guidance and centre policies.</p></div><button className="button button-primary" type="button" disabled={uploading} onClick={() => fileInput.current?.click()}><Icon name="upload" size={18} /> {uploading ? 'Processing…' : 'Upload document'}</button><input ref={fileInput} className="visually-hidden" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => handleFile(e.target.files?.[0])} /></section>
    {notice && <div className={`inline-notice ${notice.includes('ready') ? 'is-success' : ''}`}>{notice}</div>}
    <section className="document-search reveal reveal-delay-1"><form onSubmit={(e) => { e.preventDefault(); setSubmitted(Boolean(query.trim())); }}><Icon name="search" size={22} /><input aria-label="Search documents" value={query} onChange={(e) => { setQuery(e.target.value); if (!e.target.value) setSubmitted(false); }} placeholder="Ask a question or search by document title…" /><button className="button button-dark" disabled={!query.trim()}>Search</button></form><p><Icon name="lock" size={14} /> Centre policies are only visible to people in your organisation.</p></section>
    {submitted && <section className="answer-panel reveal" aria-live="polite"><div className="answer-kicker"><span className="feature-icon"><Icon name="spark" size={19} weight="fill" /></span><h2>Answer</h2></div><p className="answer-summary">{answer.summary}</p><ul>{answer.points.map((point) => <li key={point}><Icon name="check" size={17} />{point}</li>)}</ul><div className="citation-box"><strong>[1] Licensing Criteria for ECE Services</strong><span>Premises and facilities, PF6-PF11</span><button type="button">Open source <Icon name="external" size={15} /></button></div><p className="preview-disclaimer">Preview content only. Connect the RAG endpoint before relying on generated answers.</p></section>}
    <section className="library-section"><div className="section-heading-row"><h2>{query && !submitted ? `${filteredDocs.length} matching documents` : 'Library'}</h2><span className="document-count">{documents.length} files</span></div><div className="document-list">{(query && !submitted ? filteredDocs : documents).map((doc) => <article key={doc.id} className="document-row"><span className="file-badge">{doc.type}</span><div className="document-copy"><h3>{doc.title}</h3><p>{doc.source} · {doc.category}</p></div><time>{doc.updated}</time><button className="icon-button" type="button" onClick={() => setNotice('Document source links will be enabled when cloud storage is connected.')} aria-label={`Open ${doc.title}`}><Icon name="arrow" size={17} /></button></article>)}</div></section>
  </div>;
}
