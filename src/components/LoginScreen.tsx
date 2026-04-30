import { useState } from "react";

interface LoginScreenProps {
  error: string | null;
  onLogin: (username: string, password: string) => void | Promise<void>;
  loading?: boolean;
}

export function LoginScreen({ error, onLogin, loading = false }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <main className="auth-shell">

      <div className="auth-disclaimer-banner">
        <p className="auth-disclaimer-heading">Educational &amp; Training Use Only</p>
        <p className="auth-disclaimer-body">
          Fiduciary Duty is a simulated training platform designed for educational, training, and entertainment purposes only.
          All clients, portfolios, scenarios, and financial data within this application are entirely fictional.
          Nothing in this application constitutes investment advice, tax advice, legal advice, or any other form of professional financial guidance.
        </p>
        <p className="auth-disclaimer-body">
          Any advice provided to real clients must be based on current and applicable FINRA rules, regulations, and guidelines,
          as well as all other governing federal and state laws and regulations in effect at the time of the engagement.
          Regulations change — always consult current FINRA resources and qualified legal or compliance counsel before acting.
        </p>
      </div>

      <section className="auth-card">
        <header className="auth-header">
          <p className="eyebrow">Sterling Fiduciary Group</p>
          <h1>Fiduciary Duty</h1>
          <p className="auth-subtitle">Professional readiness for exam performance and real-world advisory judgment.</p>
        </header>

        <div className="auth-copy">
          <div className="auth-copy-card">
            <span>Employee Access</span>
            <strong>Fiduciary Duty — Training</strong>
            <small>Study for licensing exams, strengthen suitability judgment, and practice client-facing advisory work.</small>
          </div>
          <div className="auth-copy-card">
            <span>Manager Access</span>
            <strong>Fiduciary Duty — Manager</strong>
            <small>Monitor trainee performance, review score lanes, and manage employee training accounts.</small>
          </div>
        </div>

        <form
          className="auth-form"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            try {
              await onLogin(username, password);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Enter username" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" />
          </label>
          {error ? <div className="auth-error">{error}</div> : null}
          <button type="submit" className="primary-btn auth-submit" disabled={loading || submitting}>
            {loading ? "Loading..." : submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
