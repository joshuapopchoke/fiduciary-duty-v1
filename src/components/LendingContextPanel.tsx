import { useSelectedClient } from "../store/gameStore";

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function getCreditBand(score: number) {
  if (score >= 800) return "Exceptional (800-850)";
  if (score >= 740) return "Very good (740-799)";
  if (score >= 670) return "Good (670-739)";
  if (score >= 580) return "Fair (580-669)";
  return "Poor (300-579)";
}

function bankLendingFile(clientId: string) {
  const files: Record<string, { score: number | null; band: string; summary: string }> = {
    retiree: { score: 641, band: "Fair", summary: "Fixed-income borrower with reserve support but constrained repayment income." },
    young_pro: { score: 586, band: "Fair", summary: "High utilization and thin reserve depth require repair before a clean approval." },
    family: { score: 692, band: "Good", summary: "Household borrower is in a conditional lane pending DTI and reserve verification." },
    first_home_family: { score: 622, band: "Fair", summary: "First-home file needs documented reserves and a conservative payment cap." },
    entrepreneur: { score: 711, band: "Good", summary: "Owner-guarantor credit is acceptable, but business cash-flow coverage controls the file." },
    institutional: { score: null, band: "Business grade A-", summary: "Commercial review: DSCR, liquidity runway, covenants, collateral, and governance replace consumer FICO." }
  };

  return files[clientId] ?? null;
}

export function LendingContextPanel() {
  const activeClient = useSelectedClient();

  if (!activeClient) {
    return <section className="panel"><div className="empty-state">Select a borrower profile to load lending context.</div></section>;
  }

  const lendingFile = bankLendingFile(activeClient.id);
  const displayedScore = lendingFile?.score ?? activeClient.creditProfile.score;

  return (
    <section className="panel side-shell">
      <div className="panel-header">
        <div className="side-panel-heading">
          <h2>Lending Context</h2>
          <span className="panel-meta">Borrower quality, collateral, and requested purpose only</span>
        </div>
      </div>
      <div className="comparison-grid">
        <div className="comparison-card">
          <span>{lendingFile?.score === null ? "Business credit quality" : "Borrower quality"}</span>
          <strong>{lendingFile?.score === null ? lendingFile.band : `${displayedScore} | ${lendingFile?.band ?? getCreditBand(displayedScore)}`}</strong>
          <small>{lendingFile?.summary ?? `Full lending range: 300-850 | ${activeClient.creditProfile.recentInquiries} inquiries | ${activeClient.lendingProfile.recentLatePayments} recent late pays`}</small>
        </div>
        <div className="comparison-card">
          <span>Approval bands</span>
          <strong>800+ strong | 740+ likely | 670+ conditional</strong>
          <small>580-669 requires conditions or a smaller request. Below 580 should normally decline with a credit repair path.</small>
        </div>
        <div className="comparison-card">
          <span>Debt burden</span>
          <strong>{formatCurrency(activeClient.cashFlow.monthlyDebtPayments)}/mo</strong>
          <small>{formatCurrency(activeClient.debtProfile.creditCardBalance)} cards | {formatCurrency(activeClient.debtProfile.autoLoanBalance + activeClient.debtProfile.studentLoanBalance)} installment debt</small>
        </div>
        <div className="comparison-card">
          <span>Collateral strength</span>
          <strong>{activeClient.lendingProfile.collateralStrength}</strong>
          <small>{activeClient.debtProfile.propertyValue > 0 ? `${formatCurrency(activeClient.debtProfile.propertyValue)} property value` : "No pledged property value"} | {activeClient.lendingProfile.underwritingTrack}</small>
        </div>
        <div className="comparison-card">
          <span>Requested purpose</span>
          <strong>{activeClient.lendingProfile.requestedLoanPurpose}</strong>
          <small>{activeClient.lendingProfile.employmentStrength} employment strength | {activeClient.lendingProfile.businessCashFlowCoverage ? `${activeClient.lendingProfile.businessCashFlowCoverage.toFixed(1)}x cash-flow coverage` : "No business cash-flow coverage case"}</small>
        </div>
      </div>
    </section>
  );
}
