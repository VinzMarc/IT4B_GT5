import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const steps = [
  {
    number: "01",
    icon: "↗",
    title: "Post a report",
    description: "Share what went missing or what you picked up, with a few helpful details.",
    tone: "coral",
  },
  {
    number: "02",
    icon: "⌕",
    title: "Find a match",
    description: "Search the campus board and keep an eye out for the right item.",
    tone: "mint",
  },
  {
    number: "03",
    icon: "♡",
    title: "Make their day",
    description: "Connect the dots, verify a claim, and help something find its way home.",
    tone: "yellow",
  },
];

export default function About() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero__copy">
          <p className="eyebrow">A little campus kindness</p>
          <h1>Lost something?<br /><span>Let’s get it</span> back to you.</h1>
          <p className="about-hero__intro">
            Found / Lost is your campus exchange desk: a friendly place to report a missing item, share something
            you’ve found, and help good things find their way home.
          </p>
          <div className="about-hero__actions">
            <Link to="/items" className="about-primary-link">Explore the board <span aria-hidden="true">→</span></Link>
            <span className="about-hero__note"><span className="status-dot" /> Made for your campus community</span>
          </div>
        </div>

        <div className="about-illustration" aria-hidden="true">
          <div className="about-orbit about-orbit--outer" />
          <div className="about-orbit about-orbit--inner" />
          <div className="about-spark about-spark--one">✳</div>
          <div className="about-spark about-spark--two">✦</div>
          <div className="about-spark about-spark--three">✳</div>
          <div className="about-find-card">
            <span className="about-find-card__icon">⌕</span>
            <span><small>THE CAMPUS BOARD</small><strong>One less thing<br />to worry about.</strong></span>
            <span className="about-find-card__arrow">↗</span>
          </div>
          <div className="about-mini-card about-mini-card--found">
            <span className="about-mini-card__dot" />
            <span><small>FOUND NEAR</small><strong>The library</strong></span>
            <span className="about-mini-card__emoji">✿</span>
          </div>
          <div className="about-mini-card about-mini-card--lost">
            <span className="about-mini-card__dot" />
            <span><small>LOOKING FOR</small><strong>A little help</strong></span>
            <span className="about-mini-card__emoji">♡</span>
          </div>
          <div className="about-sticker">GOOD<br />THINGS<br /><span>FIND</span><br />THEIR<br />WAY HOME</div>
        </div>
      </section>

      <section className="about-how">
        <div className="about-section-heading">
          <div>
            <p className="panel-kicker">Simple as 1, 2, found</p>
            <h2>A small loop that<br />makes a big difference.</h2>
          </div>
          <p>Less searching alone. More neighbors helping neighbors. Here’s how the board brings both sides together.</p>
        </div>

        <div className="about-steps">
          {steps.map((step) => (
            <article className="about-step" key={step.number}>
              <div className={`about-step__icon about-step__icon--${step.tone}`} aria-hidden="true">{step.icon}</div>
              <span className="about-step__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-bottom">
        <div>
          <p className="panel-kicker">There’s a place for you here</p>
          <h2>Ready to make a little<br />campus magic?</h2>
          <p>Start with the board, or bring a project idea to our AI reviewer.</p>
        </div>
        <div className="about-bottom__actions">
          <Link to="/items" className="about-primary-link">Browse items <span aria-hidden="true">→</span></Link>
          <Link to={isAuthenticated ? "/review" : "/login"} className="about-secondary-link">
            {isAuthenticated ? "Try AI Review" : "Sign in for AI Review"} <span aria-hidden="true">✳</span>
          </Link>
        </div>
        <span className="about-bottom__decoration" aria-hidden="true">↗</span>
      </section>
    </main>
  );
}
