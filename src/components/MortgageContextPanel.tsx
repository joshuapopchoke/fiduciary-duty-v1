import { useSelectedClient } from "../store/gameStore";

function formatCurrency(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function MortgageContextPanel() {
  const activeClient = useSelectedClient();

  if (!activeClient) {
    return <section className="panel"><div className="empty-state">Select a household to load mortgage-specific context.</div></section>;
  }

  return (
    <section className="panel side-shell">
      <div className="panel-header">
        <div className="side-panel-heading">
          <h2>Mortgage Context</h2>
          <span className="panel-meta">Only the housing and debt details this module needs</span>
        </div>
      </div>
      <div className="comparison-grid">
        <div className="comparison-card">
          <span>Occupancy and loan type</span>
          <strong>{activeClient.mortgageProfile.occupancy}</strong>
          <small>{activeClient.mortgageProfile.loanPreference} preference | {activeClient.mortgageProfile.pmiActive ? "PMI active" : "No PMI"}</small>
        </div>
        <div className="comparison-card">
          <span>Mortgage stack</span>
          <strong>{formatCurrency(activeClient.debtProfile.mortgageBalance)}</strong>
          <small>{activeClient.debtProfile.mortgageTermYearsRemaining} years remaining | rate {(activeClient.debtProfile.mortgageRate * 100).toFixed(2)}%</small>
        </div>
        <div className="comparison-card">
          <span>Housing carry</span>
          <strong>{formatCurrency(activeClient.debtProfile.housingPayment)}/mo</strong>
          <small>Taxes {formatCurrency(activeClient.mortgageProfile.propertyTaxMonthly)} | Insurance {formatCurrency(activeClient.mortgageProfile.homeownerInsuranceMonthly)}</small>
        </div>
        <div className="comparison-card">
          <span>Debt profile</span>
          <strong>{formatCurrency(activeClient.debtProfile.creditCardBalance + activeClient.debtProfile.unsecuredDebt)} revolving</strong>
          <small>{activeClient.debtProfile.helocBalance > 0 ? `${formatCurrency(activeClient.debtProfile.helocBalance)} HELOC` : "No HELOC"} | {activeClient.debtProfile.unpaidDebtBalance > 0 ? `${formatCurrency(activeClient.debtProfile.unpaidDebtBalance)} unpaid debt` : "No unpaid debt"}</small>
        </div>
      </div>
    </section>
  );
}
