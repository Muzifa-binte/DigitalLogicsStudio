import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../Home/Navbar";
import Footer from "../Home/Footer";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

export default function ProfilePage() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [logoutError, setLogoutError] = React.useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      setLogoutError(
        error.response?.data?.message || "Unable to log out right now.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <div className="grid-background" />
      <Navbar toggleTheme={toggleTheme} theme={theme} />

      <main className="auth-main">
        <section className="profile-panel">
          <div className="profile-hero">
            <span className="auth-eyebrow">Authenticated session</span>
            <h1>Welcome back, {user?.name || "Learner"}.</h1>
            <p>
              Your JWT session is active, and your account details are being
              loaded securely from the backend.
            </p>
          </div>

          <div className="profile-grid">
            <article className="profile-card">
              <h2>Account Overview</h2>
              <dl className="profile-details">
                <div>
                  <dt>Name</dt>
                  <dd>{user?.name}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{user?.email}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>Logged in</dd>
                </div>
              </dl>
            </article>

            <article className="profile-card">
              <h2>Next Steps</h2>
              <p>
                You can continue exploring Boolforge tools while your session
                stays available across refreshes and future visits.
              </p>
              {logoutError ? <p className="auth-error">{logoutError}</p> : null}
              <div className="profile-actions">
                <button
                  type="button"
                  className="auth-submit"
                  onClick={() => navigate("/boolforge")}
                >
                  Go to Circuit Forge
                </button>
                <button
                  type="button"
                  className="auth-secondary-btn"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
