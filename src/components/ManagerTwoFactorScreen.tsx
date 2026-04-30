import { useMemo, useState } from "react";
import { buildOtpAuthUri, buildQrImageUrl } from "../engine/totpEngine";
import type { User } from "../types/auth";

interface ManagerTwoFactorScreenProps {
  managerUser: User;
  error: string | null;
  onVerify: (token: string) => void | Promise<void>;
  onBack: () => void;
}

export function ManagerTwoFactorScreen({ managerUser, error, onVerify, onBack }: ManagerTwoFactorScreenProps) {
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const issuer = "Fiduciary Duty";
  const secret = managerUser.twoFactorSecret ?? "";
  const otpAuthUri = useMemo(() => buildOtpAuthUri(secret, managerUser.username, issuer), [secret, managerUser.username]);
  const qrImageUrl = useMemo(() => buildQrImageUrl(otpAuthUri), [otpAuthUri]);

  return (
    <main className="auth-shell">
      <section className="auth-card auth-card--two-factor">
        <header className="auth-header">
          <p className="eyebrow">Sterling Fiduciary Group</p>
          <h1>Manager Verification</h1>
          <p className="auth-subtitle">Scan the authenticator QR code, then enter the 6-digit time-based verification code to continue to the manager portal.</p>
        </header>

        <div className="two-factor-grid">
          <div className="two-factor-qr-card">
            <img className="two-factor-qr" src={qrImageUrl} alt="Authenticator enrollment QR code" />
            <small>Scan with Google Authenticator, Microsoft Authenticator, Authy, or another TOTP app.</small>
          </div>
          <div className="two-factor-copy">
            <div className="auth-copy-card">
              <span>Setup key</span>
              <strong>{secret}</strong>
              <small>Manual entry fallback if the QR code cannot be scanned on this device.</small>
            </div>
            <form
              className="auth-form"
              onSubmit={async (event) => {
                event.preventDefault();
                setSubmitting(true);
                try {
                  await onVerify(token);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <label>
                Authenticator code
                <input
                  inputMode="numeric"
                  maxLength={6}
                  value={token}
                  onChange={(event) => setToken(event.target.value.replace(/\D+/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit code"
                />
              </label>
              {error ? <div className="auth-error">{error}</div> : null}
              <div className="slot-actions">
                <button type="submit" className="primary-btn auth-submit" disabled={submitting}>
                  {submitting ? "Verifying..." : "Verify and Continue"}
                </button>
                <button type="button" className="control-btn" onClick={onBack}>
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
