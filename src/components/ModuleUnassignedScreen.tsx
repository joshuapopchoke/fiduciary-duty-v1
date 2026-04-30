interface ModuleUnassignedScreenProps {
  onLogout: () => void;
}

export function ModuleUnassignedScreen({ onLogout }: ModuleUnassignedScreenProps) {
  return (
    <main className="auth-shell">
      <section className="auth-card module-lock-card">
        <div className="auth-copy">
          <p className="eyebrow">Fiduciary Duty</p>
          <h1>MODULE UNASSIGNED.</h1>
          <p className="auth-subtitle">PLEASE CONSULT WITH YOUR MANAGER TO GAIN ACCESS!</p>
          <div className="login-role-grid">
            <div className="login-role-card">
              <strong>Why you are seeing this</strong>
              <span>Your training profile does not currently have an active module assigned.</span>
            </div>
            <div className="login-role-card">
              <strong>What happens next</strong>
              <span>Once a manager assigns a module, your training workspace will unlock automatically.</span>
            </div>
          </div>
        </div>
        <div className="slot-actions">
          <button type="button" className="control-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}
