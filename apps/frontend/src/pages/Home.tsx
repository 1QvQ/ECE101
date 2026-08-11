import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

const benefits = [
  {
    icon: 'spark' as const,
    title: 'Plan with what you have',
    copy: 'Find adaptable activities by age, time, theme, and materials already in your centre.',
  },
  {
    icon: 'file' as const,
    title: 'Find the right guidance',
    copy: 'Search centre policies and trusted ECE documents without hunting through folders.',
  },
  {
    icon: 'book' as const,
    title: 'Keep what worked',
    copy: 'Save observations, reflections, and ideas so useful practice is easy to return to.',
  },
];

export default function Home() {
  return (
    <div className="home-page">
      <a className="skip-link" href="#home-main">Skip to content</a>

      <header className="home-header">
        <div className="home-nav">
          <Link to="/" className="brand" aria-label="ECE101 home">
            <span className="brand-mark"><Icon name="leaf" size={19} weight="fill" /></span>
            <span>ECE<span>101</span></span>
          </Link>
          <nav className="home-nav-links" aria-label="Public navigation">
            <a href="#how-it-helps">How it helps</a>
            <a href="#made-for-teachers">For teachers</a>
          </nav>
          <div className="home-nav-actions">
            <Link to="/login" className="home-sign-in">Sign in</Link>
            <Link to="/register" className="button button-primary">Create account</Link>
          </div>
        </div>
      </header>

      <main id="home-main">
        <section className="home-hero">
          <div className="home-hero-copy">
            <h1>Make room for what matters.</h1>
            <p>Plan activities, find trusted guidance, and keep your teaching knowledge close.</p>
            <div className="home-hero-actions">
              <Link to="/register" className="button button-primary">Create account <Icon name="arrow" size={17} /></Link>
              <Link to="/login" className="button button-secondary">Sign in</Link>
            </div>
          </div>
          <figure className="home-hero-media">
            <img
              src="/ece101-hero-educator.webp"
              alt="An early childhood teacher preparing a nature activity with leaves and clay"
              width="1122"
              height="1402"
              fetchPriority="high"
            />
          </figure>
        </section>

        <section className="home-intro" id="how-it-helps" aria-labelledby="home-intro-heading">
          <div>
            <h2 id="home-intro-heading">One place for the work behind the play.</h2>
            <p>ECE101 brings planning, guidance, and reflective practice together in a workspace made for early childhood educators.</p>
          </div>
          <div className="home-benefit-list">
            {benefits.map((benefit) => (
              <article key={benefit.title}>
                <Icon name={benefit.icon} size={23} />
                <div><h3>{benefit.title}</h3><p>{benefit.copy}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-story" id="made-for-teachers" aria-labelledby="home-story-heading">
          <figure>
            <img
              src="/ece101-activity-table.webp"
              alt="Children and a teacher pressing leaves into clay at a wooden table"
              width="1536"
              height="1024"
              loading="lazy"
            />
          </figure>
          <div className="home-story-copy">
            <h2 id="home-story-heading">Made for real teaching days.</h2>
            <p>Use a ready-to-adapt idea, check a policy, or jot down what you noticed. ECE101 stays useful without asking you to change how you teach.</p>
            <Link to="/register" className="text-link">Create account <Icon name="arrow" size={16} /></Link>
          </div>
        </section>

        <section className="home-closing" aria-labelledby="home-closing-heading">
          <h2 id="home-closing-heading">A calmer start to tomorrow.</h2>
          <p>Keep the useful things close, then get back to your tamariki.</p>
          <Link to="/register" className="button button-primary">Create account <Icon name="arrow" size={17} /></Link>
        </section>
      </main>

      <footer className="home-footer">
        <Link to="/" className="brand" aria-label="ECE101 home">
          <span className="brand-mark"><Icon name="leaf" size={18} weight="fill" /></span>
          <span>ECE<span>101</span></span>
        </Link>
        <p>Made for early childhood educators.</p>
        <div><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link></div>
      </footer>
    </div>
  );
}
