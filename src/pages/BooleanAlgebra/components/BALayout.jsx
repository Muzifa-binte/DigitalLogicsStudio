import React, { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import progressService from "../../../services/progressService";
import "./BALayout.css";
import { baPages } from "./baConfig";

// ── Subtopic ID map: page path → id used in coreTopics.js ─────────────────
// Must match the `id` values in src/data/coreTopics.js > boolean-algebra.links
const PATH_TO_SUBTOPIC_ID = {
  "/boolean/overview": "overview",
  "/boolean/identities": "identities",
  "/boolean/laws": "laws",
  "/boolean/duality": "duality",
  "/boolean/consensus": "consensus",
  "/boolean/complement": "complement",
  "/boolean/minterms": "minterms",
  "/boolean/maxterms": "maxterms",
  "/boolean/minterms-maxterms": "relation",
  "/boolean/significant-digits": "significant-digits",
};

// Minimal topic descriptor — mirrors coreTopics.js so progressService can
// recalculate completion percentages correctly.
const BA_TOPIC = {
  id: "boolean-algebra",
  title: "BOOLEAN ALGEBRA",
  links: Object.values(PATH_TO_SUBTOPIC_ID).map((id) => ({ id })),
};

const CATALOG = { topics: [BA_TOPIC], problems: [] };

// ── Icons ──────────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function getCompletedSubtopics(userKey) {
  const snap = progressService.getSnapshot(userKey, CATALOG);
  return snap.state.topics?.["boolean-algebra"]?.completedSubtopics || [];
}

// ── Component ──────────────────────────────────────────────────────────────
const BALayout = ({ title, subtitle, intro, highlights = [], children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const { user } = useAuth();

  const currentPath = location.pathname;
  const currentIndex = baPages.findIndex((p) => p.path === currentPath);
  const subtopicId = PATH_TO_SUBTOPIC_ID[currentPath] || null;
  const userKey = progressService.getUserKey(user);

  // ── Derive read state from progressService cache ───────────────────────
  const [completedSubtopics, setCompletedSubtopics] = useState(() =>
    getCompletedSubtopics(userKey),
  );

  // Refresh when path or user changes (e.g. navigating between pages)
  useEffect(() => {
    setCompletedSubtopics(getCompletedSubtopics(userKey));
  }, [currentPath, userKey]);

  const isRead = subtopicId ? completedSubtopics.includes(subtopicId) : false;

  const toggleRead = useCallback(async () => {
    if (!subtopicId) return;
    // Optimistic update so the UI feels instant
    setCompletedSubtopics((prev) =>
      prev.includes(subtopicId)
        ? prev.filter((id) => id !== subtopicId)
        : [...prev, subtopicId],
    );
    // Delegate to progressService — same function the homepage pill uses,
    // so both stay in sync through the shared in-memory cache + backend.
    await progressService.toggleSubtopicCompleted(
      userKey,
      BA_TOPIC,
      subtopicId,
      CATALOG,
    );
    // Reconcile with the real cache value after the async write
    setCompletedSubtopics(getCompletedSubtopics(userKey));
  }, [subtopicId, userKey]);

  // ── Progress ring ──────────────────────────────────────────────────────
  const readCount = completedSubtopics.filter((sid) =>
    Object.values(PATH_TO_SUBTOPIC_ID).includes(sid),
  ).length;
  const progress = Math.round((readCount / baPages.length) * 100);
  const progressDash = progress * 0.879;

  const prev = currentIndex > 0 ? baPages[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < baPages.length - 1
      ? baPages[currentIndex + 1]
      : null;

  return (
    <div className="ba-layout">
      <div className="ba-bg ba-bg-1" />
      <div className="ba-bg ba-bg-2" />

      {/* ── TOPBAR ──────────────────────────────────────────── */}
      <header className="ba-topbar">
        <div className="ba-topbar-left">
          <button
            className={`ba-hamburger${sidebarOpen ? " is-open" : ""}`}
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={sidebarOpen}
          >
            <span className="ba-ham-bar" />
            <span className="ba-ham-bar" />
            <span className="ba-ham-bar" />
          </button>
          <Link to="/" className="ba-topbar-link">
            <Home size={15} aria-hidden="true" />
            <span>Home</span>
          </Link>
        </div>

        <div className="ba-topbar-center">
          <span className="ba-category-pill">
            <span className="ba-pill-dot" />
            Boolean Algebra
          </span>
        </div>

        <div className="ba-topbar-right">
          <button
            className="ba-theme-btn"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <div
            className="ba-progress-ring-wrap"
            title={`${readCount} of ${baPages.length} read`}
          >
            <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="rgba(139,92,246,0.2)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#c4b5fd"
                strokeWidth="3"
                strokeDasharray={`${progressDash} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
                style={{ transition: "stroke-dasharray 0.4s ease" }}
              />
            </svg>
            <span className="ba-progress-text">
              {readCount}/{baPages.length}
            </span>
          </div>
        </div>
      </header>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="ba-body">
        {sidebarOpen && (
          <div
            className="ba-overlay"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={`ba-sidebar${sidebarOpen ? " is-open" : ""}`}
          aria-label="Boolean Algebra module navigation"
        >
          <div className="ba-sidebar-inner">
            <div className="ba-sidebar-card">
              <p className="ba-sidebar-kicker">Learning Path</p>
              <h2 className="ba-sidebar-title">Boolean Algebra</h2>
              <p className="ba-sidebar-copy">
                Master the mathematical foundation of all digital logic, one
                concept at a time.
              </p>
              <div className="ba-sidebar-progress-bar">
                <div
                  className="ba-sidebar-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="ba-sidebar-progress-label">
                {progress}% read
              </span>
            </div>

            <nav className="ba-sidebar-nav">
              {baPages.map((page, index) => {
                const sid = PATH_TO_SUBTOPIC_ID[page.path];
                const pageRead = sid ? completedSubtopics.includes(sid) : false;
                return (
                  <NavLink
                    key={page.path}
                    to={page.path}
                    className={({ isActive }) =>
                      `ba-nav-item${isActive ? " is-active" : ""}${pageRead ? " is-read" : ""}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="ba-nav-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="ba-nav-copy">
                      <span className="ba-nav-label">{page.label}</span>
                      <span className="ba-nav-description">
                        {page.description}
                      </span>
                    </span>
                    <span className="ba-nav-status">
                      {pageRead && (
                        <span className="ba-nav-check" title="Read">
                          ✓
                        </span>
                      )}
                    </span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="ba-sidebar-footer">
              <Link to="/" className="ba-sidebar-home-btn">
                ← Back to All Topics
              </Link>
            </div>
          </div>
        </aside>

        {/* ── MAIN ──────────────────────────────────────────── */}
        <main className="ba-main">
          <nav className="ba-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="ba-bc-link">
              Home
            </Link>
            <span className="ba-bc-sep">›</span>
            <span className="ba-bc-mid">Boolean Algebra</span>
            <span className="ba-bc-sep">›</span>
            <span className="ba-bc-current">{title}</span>
          </nav>

          <section className="ba-hero">
            <div className="ba-hero-badge">
              <span className="ba-hero-badge-label">Chapter</span>
              <strong className="ba-hero-badge-num">{currentIndex + 1}</strong>
            </div>
            <p className="ba-hero-kicker">Boolean Algebra</p>
            <h1 className="ba-hero-title">{title}</h1>
            {subtitle ? <p className="ba-hero-subtitle">{subtitle}</p> : null}
            {intro ? <p className="ba-hero-intro">{intro}</p> : null}

            {highlights.length > 0 ? (
              <div className="ba-hero-highlights">
                {highlights.map((item) => (
                  <div key={item.title} className="ba-hero-highlight">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="ba-chapter-dots">
              {baPages.map((p, i) => {
                const sid = PATH_TO_SUBTOPIC_ID[p.path];
                const done = sid ? completedSubtopics.includes(sid) : false;
                return (
                  <Link
                    key={p.path}
                    to={p.path}
                    className={`ba-dot${i === currentIndex ? " active" : ""}${done ? " done" : ""}`}
                    title={p.label}
                  />
                );
              })}
            </div>
          </section>

          <div className="ba-content">{children}</div>

          {/* ── FOOTER NAV ────────────────────────────────────── */}
          <footer className="ba-footer-nav">
            {/* ← Previous */}
            {prev ? (
              <NavLink to={prev.path} className="ba-footer-link">
                <span className="ba-footer-arrow">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M13 5l-5 5 5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>
                  <span className="ba-footer-label">Previous</span>
                  <span className="ba-footer-title">{prev.label}</span>
                </span>
              </NavLink>
            ) : (
              <div />
            )}

            {/* Mark as Read + Next →  grouped on the right */}
            <div className="ba-footer-right">
              {subtopicId && (
                <button
                  className={`ba-mark-read-btn${isRead ? " is-read" : ""}`}
                  onClick={toggleRead}
                  aria-pressed={isRead}
                  aria-label={isRead ? "Mark as unread" : "Mark as read"}
                >
                  <CheckCircleIcon />
                  <span>{isRead ? "Marked as Read" : "Mark as Read"}</span>
                </button>
              )}

              {next ? (
                <NavLink
                  to={next.path}
                  className="ba-footer-link ba-footer-link-next"
                >
                  <span>
                    <span className="ba-footer-label">Next</span>
                    <span className="ba-footer-title">{next.label}</span>
                  </span>
                  <span className="ba-footer-arrow ba-footer-arrow-next">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 5l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </NavLink>
              ) : (
                <Link to="/" className="ba-footer-link ba-footer-link-next">
                  <span>
                    <span className="ba-footer-label">All done!</span>
                    <span className="ba-footer-title">Return to Home</span>
                  </span>
                  <span className="ba-footer-arrow ba-footer-arrow-next">
                    <Home size={16} aria-hidden="true" />
                  </span>
                </Link>
              )}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default BALayout;
