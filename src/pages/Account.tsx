import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Account() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const displayName = user?.name ?? "Guest";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <section className="account-page">
      <header className="account-hero">
        <div className="account-hero__copy">
          <p className="eyebrow">Your campus corner</p>
          <h1>Good to see you, {displayName.split(/\s+/)[0]}.</h1>
          <p>Keep your campus account details close, and pick up where you left off.</p>
        </div>
        <div className="account-stamp" aria-hidden="true">
          <span>F / L</span>
          <small>FOUND<br />TOGETHER</small>
        </div>
      </header>

      <div className="account-grid">
        <article className="account-profile">
          <div className="account-profile__top">
            <div className="account-avatar" aria-hidden="true">{initials || "?"}</div>
            <div>
              <span className="account-member-tag"><span className="status-dot" /> Campus member</span>
              <h2>{displayName}</h2>
              <p>Your Found / Lost profile</p>
            </div>
          </div>
          <div className="account-divider" />
          <dl className="account-details">
            <div>
              <dt>Full name</dt>
              <dd>{displayName}</dd>
            </div>
            <div>
              <dt>Email address</dt>
              <dd>{user?.email ?? "Not available"}</dd>
            </div>
          </dl>
          <button onClick={handleLogout} className="account-logout" type="button">
            <span aria-hidden="true">↗</span> Log out
          </button>
        </article>

        <aside className="account-shortcuts">
          <div className="account-shortcuts__heading">
            <p className="panel-kicker">A little momentum</p>
            <h2>What’s next?</h2>
          </div>
          <Link to="/items" className="account-shortcut account-shortcut--browse">
            <span className="account-shortcut__icon" aria-hidden="true">⌕</span>
            <span><strong>Browse the board</strong><small>See what’s been lost or found around campus.</small></span>
            <span className="account-shortcut__arrow" aria-hidden="true">→</span>
          </Link>
          <Link to="/review" className="account-shortcut account-shortcut--review">
            <span className="account-shortcut__icon" aria-hidden="true">✳</span>
            <span><strong>Get an AI review</strong><small>Share a project and get thoughtful feedback.</small></span>
            <span className="account-shortcut__arrow" aria-hidden="true">→</span>
          </Link>
          <div className="account-note">
            <span aria-hidden="true">✦</span>
            <p>A small act of returning can make someone’s whole day.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
