import { useMemo, useState, useCallback } from "react";
import { useSelectedClient, useGameStore } from "../store/gameStore";
import { US_STATES } from "../data/usStates";
import { calculateCompleteTax, calculateTaxScenario, type IncomeComponents } from "../engine/incomeTaxEngine";
import { getStateTaxProfile } from "../data/stateTaxData";

function fmt(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function pct(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}
function shortPct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

type CalcTab = "summary" | "federal" | "state" | "scenario" | "comparison";

// Editable income field descriptor
interface IncomeField {
  key: keyof IncomeComponents;
  label: string;
  tooltip: string;
  deduction?: boolean;
}

const INCOME_FIELDS: IncomeField[] = [
  { key: "wages", label: "Wages / Salary / Self-Employment", tooltip: "W-2 wages, salaries, and net self-employment income (before SE deduction)" },
  { key: "retirementDistributions", label: "IRA / 401(k) Distributions", tooltip: "Taxable distributions from traditional retirement accounts — fully ordinary income" },
  { key: "pensionIncome", label: "Pension / Annuity Income", tooltip: "Taxable portion of pension and annuity payments" },
  { key: "socialSecurityBenefits", label: "Social Security Benefits (gross)", tooltip: "Gross SS benefits — 0–85% is taxable based on provisional income (IRC §86)" },
  { key: "interestIncome", label: "Taxable Interest Income", tooltip: "Bank interest, CD interest, taxable bond interest — ordinary income" },
  { key: "ordinaryDividends", label: "Ordinary Dividends", tooltip: "Non-qualified dividends taxed at ordinary rates" },
  { key: "qualifiedDividends", label: "Qualified Dividends (subset of above)", tooltip: "Dividends meeting holding period requirements — taxed at LTCG rates (IRC §1(h))" },
  { key: "shortTermGains", label: "Short-Term Capital Gains", tooltip: "Gains on assets held ≤ 1 year — ordinary income rates" },
  { key: "longTermGains", label: "Long-Term Capital Gains", tooltip: "Gains on assets held > 1 year — preferential LTCG rates (0%, 15%, 20%)" },
  { key: "otherOrdinaryIncome", label: "Other Income (rental, royalties, etc.)", tooltip: "Rental income, royalties, partnership income, and other NII items" },
  { key: "traditionalIraContribution", label: "Traditional IRA Deduction (above-line)", tooltip: "Deductible traditional IRA contribution — reduces AGI if eligible (IRC §219)", deduction: true },
  { key: "otherAboveLineDeductions", label: "Other Above-Line Deductions", tooltip: "HSA contributions, student loan interest, SE health insurance, etc.", deduction: true }
];

export function IncomeTaxCalculatorPanel() {
  const activeClient = useSelectedClient();
  const tickers = useGameStore(state => state.tickers);

  // State selection
  const [selectedState, setSelectedState] = useState<string>("CA");
  const [activeTab, setActiveTab] = useState<CalcTab>("summary");

  // Income override state — trainee can edit each income component
  const [overrides, setOverrides] = useState<Partial<Record<keyof IncomeComponents, string>>>({});

  // Scenario state — second set of inputs for side-by-side comparison
  const [scenarioOverrides, setScenarioOverrides] = useState<Partial<Record<keyof IncomeComponents, string>>>({});

  const totalAum = activeClient
    ? activeClient.cash + Object.values(activeClient.holdings).reduce(
        (sum, h) => sum + (tickers[h.ticker]?.price ?? 0) * h.shares, 0
      )
    : 0;

  // Convert string overrides to numbers for calculation
  function parseOverrides(raw: Partial<Record<keyof IncomeComponents, string>>): Partial<IncomeComponents> {
    const result: Partial<IncomeComponents> = {};
    for (const [k, v] of Object.entries(raw)) {
      const num = parseFloat((v ?? "").replace(/[,$]/g, ""));
      if (!isNaN(num)) {
        (result as Record<string, number>)[k] = Math.max(0, num);
      }
    }
    return result;
  }

  const baseCalc = useMemo(() => {
    if (!activeClient) return null;
    return calculateCompleteTax(activeClient, tickers, selectedState, parseOverrides(overrides));
  }, [activeClient, tickers, selectedState, overrides]);

  const scenarioCalc = useMemo(() => {
    if (!activeClient || activeTab !== "scenario" && activeTab !== "comparison") return null;
    const merged = { ...parseOverrides(overrides), ...parseOverrides(scenarioOverrides) };
    return calculateTaxScenario(activeClient, tickers, selectedState, merged);
  }, [activeClient, tickers, selectedState, overrides, scenarioOverrides, activeTab]);

  const stateProfile = useMemo(() => getStateTaxProfile(selectedState), [selectedState]);

  const handleIncomeChange = useCallback((key: keyof IncomeComponents, value: string) => {
    setOverrides(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleScenarioChange = useCallback((key: keyof IncomeComponents, value: string) => {
    setScenarioOverrides(prev => ({ ...prev, [key]: value }));
  }, []);

  if (!activeClient) {
    return (
      <section className="panel">
        <div className="empty-state">Select a client to calculate their federal and state income tax liability.</div>
      </section>
    );
  }

  if (!baseCalc) return null;

  const f = baseCalc.federal;
  const s = baseCalc.state;
  const ic = baseCalc.incomeComponents;

  const tabs: { id: CalcTab; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "federal", label: "Federal Detail" },
    { id: "state", label: "State Detail" },
    { id: "scenario", label: "What-If" },
    { id: "comparison", label: "State Comparison" }
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Income Tax Calculator</h2>
        <span className="panel-meta">{activeClient.name} | {baseCalc.filingStatus === "mfj" ? "Married Filing Jointly" : "Single"} | Federal + State 2024</span>
      </div>

      {/* State selector */}
      <div className="portfolio-section">
        <div className="portfolio-section-title">State of Residence</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", padding: "0 0 12px 0" }}>
          <select
            className="manager-input"
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            style={{ minWidth: 220 }}
          >
            {US_STATES.map(st => (
              <option key={st.code} value={st.code}>{st.code} — {st.name}</option>
            ))}
            <option value="DC">DC — District of Columbia</option>
          </select>
          {stateProfile && (
            <span className="panel-meta">
              {stateProfile.type === "none"
                ? "✓ No state income tax"
                : stateProfile.type === "flat"
                  ? `Flat ${pct(stateProfile.flatRate ?? 0)} rate`
                  : `Graduated — top rate ${pct(stateProfile.topMarginalRate)}`}
            </span>
          )}
        </div>
      </div>

      {/* Income inputs */}
      <div className="portfolio-section">
        <div className="portfolio-section-title">Income Components (edit to adjust)</div>
        <div className="comparison-grid">
          {INCOME_FIELDS.map(field => {
            const defaultVal = (ic[field.key] as number) ?? 0;
            const displayVal = overrides[field.key] ?? (defaultVal > 0 ? String(Math.round(defaultVal)) : "");
            return (
              <div key={field.key} className="comparison-card" style={field.deduction ? { borderLeft: "3px solid var(--color-border-success, #28a745)" } : {}}>
                <span style={{ fontSize: 11 }}>{field.deduction ? "▼ Deduction" : "▲ Income"}</span>
                <strong style={{ fontSize: 12 }}>{field.label}</strong>
                <input
                  type="text"
                  className="manager-input"
                  placeholder={defaultVal > 0 ? fmt(Math.round(defaultVal)) : "$0"}
                  value={displayVal}
                  onChange={e => handleIncomeChange(field.key, e.target.value)}
                  style={{ marginTop: 4, width: "100%" }}
                />
                <small style={{ marginTop: 2 }}>{field.tooltip}</small>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} type="button"
            className={activeTab === t.id ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab(t.id)}
          >{t.label}</button>
        ))}
      </div>

      {/* ── SUMMARY TAB ── */}
      {activeTab === "summary" && (
        <>
          <div className="comparison-grid">
            <div className="comparison-card">
              <span>Gross Income</span>
              <strong>{fmt(f.grossIncome)}</strong>
              <small>Before any deductions</small>
            </div>
            <div className="comparison-card">
              <span>Adjusted Gross Income (AGI)</span>
              <strong>{fmt(f.adjustedGrossIncome)}</strong>
              <small>After above-line deductions</small>
            </div>
            <div className="comparison-card">
              <span>Federal Standard Deduction</span>
              <strong>{fmt(f.standardDeduction)}</strong>
              <small>IRC §63(c) — {baseCalc.filingStatus === "mfj" ? "MFJ" : "Single"} filer 2024</small>
            </div>
            <div className="comparison-card">
              <span>Federal Taxable Income</span>
              <strong>{fmt(f.taxableIncome)}</strong>
              <small>AGI − standard deduction</small>
            </div>
            <div className="comparison-card">
              <span>Federal Income Tax</span>
              <strong>{fmt(f.totalFederalTax)}</strong>
              <small>Ordinary {fmt(f.ordinaryIncomeTax)} + LTCG {fmt(f.preferentialIncomeTax)}{f.niitApplies ? ` + NIIT ${fmt(f.niitAmount)}` : ""}</small>
            </div>
            <div className="comparison-card">
              <span>State Income Tax — {s?.stateName ?? selectedState}</span>
              <strong>{s?.taxType === "none" ? "$0 (no state tax)" : fmt(s?.stateTax ?? 0)}</strong>
              <small>{s?.taxType === "flat" ? `Flat rate applied` : s?.taxType === "none" ? s.specialNotes : `Graduated brackets applied`}</small>
            </div>
            <div className="comparison-card">
              <span>Total Tax Liability</span>
              <strong style={{ color: "var(--color-text-danger, #dc3545)" }}>{fmt(baseCalc.combinedTotalTax)}</strong>
              <small>Federal + State combined</small>
            </div>
            <div className="comparison-card">
              <span>After-Tax Income</span>
              <strong style={{ color: "var(--color-text-success, #28a745)" }}>{fmt(baseCalc.afterTaxIncome)}</strong>
              <small>Gross income − total tax</small>
            </div>
            <div className="comparison-card">
              <span>Federal Effective Rate</span>
              <strong>{pct(f.effectiveFederalRate)}</strong>
              <small>Total federal tax ÷ gross income</small>
            </div>
            <div className="comparison-card">
              <span>Combined Effective Rate</span>
              <strong>{pct(baseCalc.combinedEffectiveRate)}</strong>
              <small>Federal + state tax ÷ gross income</small>
            </div>
            <div className="comparison-card">
              <span>Federal Marginal Rate (ordinary)</span>
              <strong>{pct(f.marginalOrdinaryRate)}</strong>
              <small>Rate on next dollar of ordinary income</small>
            </div>
            <div className="comparison-card">
              <span>Combined Marginal Rate</span>
              <strong>{pct(baseCalc.combinedMarginalRate)}</strong>
              <small>Federal {pct(f.marginalOrdinaryRate)} + State {pct(baseCalc.marginalStateRate)}</small>
            </div>
          </div>
          {baseCalc.planningNotes.length > 0 && (
            <div className="portfolio-section">
              <div className="portfolio-section-title">Planning Insights</div>
              {baseCalc.planningNotes.map((note, i) => (
                <div key={i} className="portfolio-summary-card" style={{ marginBottom: 6 }}>
                  <small>💡 {note}</small>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── FEDERAL DETAIL TAB ── */}
      {activeTab === "federal" && (
        <>
          <div className="portfolio-section">
            <div className="portfolio-section-title">Income Breakdown</div>
            <div className="comparison-grid">
              {[
                { label: "Ordinary taxable income", val: f.ordinaryTaxableIncome, note: "Wages, interest, ordinary dividends, STCG, pension, RMDs, taxable SS" },
                { label: "Preferential income (LTCG + qualified divs)", val: f.preferentialIncome, note: "Taxed at 0%/15%/20% LTCG rates — not ordinary income" },
                { label: "Net investment income (for NIIT)", val: f.netInvestmentIncome, note: "Interest, dividends, capital gains, passive income — subject to 3.8% if AGI above threshold" }
              ].map(row => (
                <div key={row.label} className="comparison-card">
                  <span>{row.label}</span>
                  <strong>{fmt(row.val)}</strong>
                  <small>{row.note}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="portfolio-section">
            <div className="portfolio-section-title">Federal Tax Bracket Breakdown</div>
            <div className="comparison-grid">
              {f.bracketBreakdown.length === 0 ? (
                <div className="comparison-card">
                  <span>No taxable income</span>
                  <strong>$0 tax</strong>
                  <small>Deductions and exemptions eliminate federal tax liability.</small>
                </div>
              ) : f.bracketBreakdown.map((row, i) => (
                <div key={i} className="comparison-card">
                  <span>{row.bracket} bracket</span>
                  <strong>{fmt(row.income)} taxed → {fmt(row.tax)}</strong>
                  <small>Tax in this bracket</small>
                </div>
              ))}
            </div>
          </div>
          <div className="portfolio-section">
            <div className="portfolio-section-title">Federal Tax Components</div>
            <div className="comparison-grid">
              <div className="comparison-card">
                <span>Ordinary income tax</span>
                <strong>{fmt(f.ordinaryIncomeTax)}</strong>
                <small>Tax on wages, interest, ordinary dividends, and other ordinary income</small>
              </div>
              <div className="comparison-card">
                <span>Preferential income tax (LTCG/QD)</span>
                <strong>{fmt(f.preferentialIncomeTax)}</strong>
                <small>Tax on long-term capital gains and qualified dividends at IRC §1(h) rates</small>
              </div>
              <div className="comparison-card">
                <span>Net Investment Income Tax (NIIT)</span>
                <strong>{f.niitApplies ? fmt(f.niitAmount) : "N/A"}</strong>
                <small>{f.niitApplies ? `3.8% × ${fmt(Math.round(f.niitAmount / NIIT_RATE))} NII above AGI threshold (IRC §1411)` : "AGI below NIIT threshold — does not apply"}</small>
              </div>
              <div className="comparison-card">
                <span>Total federal tax</span>
                <strong>{fmt(f.totalFederalTax)}</strong>
                <small>Effective rate: {pct(f.effectiveFederalRate)} | Marginal rate: {pct(f.marginalOrdinaryRate)}</small>
              </div>
              {f.preferentialIncome > 0 && (
                <div className="comparison-card">
                  <span>LTCG / qualified dividend rate</span>
                  <strong>{pct(f.marginalLtcgRate)}{f.niitApplies ? ` + ${pct(NIIT_RATE)} NIIT = ${pct(f.marginalLtcgRate + NIIT_RATE)}` : ""}</strong>
                  <small>Rate on long-term gains and qualified dividends at this AGI level</small>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── STATE DETAIL TAB ── */}
      {activeTab === "state" && s && (
        <>
          <div className="portfolio-section">
            <div className="portfolio-section-title">{s.stateName} Income Tax</div>
            {s.taxType === "none" ? (
              <div className="portfolio-summary-card">
                <span>No State Income Tax</span>
                <strong>{s.stateName}</strong>
                <small>{s.specialNotes}</small>
              </div>
            ) : (
              <div className="comparison-grid">
                <div className="comparison-card">
                  <span>State AGI (= federal AGI here)</span>
                  <strong>{fmt(s.stateAgi)}</strong>
                  <small>Most states start with federal AGI and apply state-specific adjustments; simplified here</small>
                </div>
                <div className="comparison-card">
                  <span>State deduction + exemption</span>
                  <strong>−{fmt(s.stateDeduction)}</strong>
                  <small>State standard deduction + personal exemption</small>
                </div>
                <div className="comparison-card">
                  <span>State taxable income</span>
                  <strong>{fmt(s.stateTaxableIncome)}</strong>
                  <small>State AGI − deductions</small>
                </div>
                <div className="comparison-card">
                  <span>State income tax</span>
                  <strong>{fmt(s.stateTax)}</strong>
                  <small>Effective state rate: {pct(s.effectiveStateRate)} | Marginal: {pct(s.marginalStateRate)}</small>
                </div>
                <div className="comparison-card">
                  <span>State tax type</span>
                  <strong>{s.taxType === "flat" ? `Flat ${pct(s.topMarginalStateRate)}` : `Graduated — top rate ${pct(s.topMarginalStateRate)}`}</strong>
                  <small>{s.taxType === "graduated" ? "Multiple tax brackets apply" : "Single rate applies to all taxable income"}</small>
                </div>
                {s.specialNotes && (
                  <div className="comparison-card" style={{ gridColumn: "1 / -1" }}>
                    <span>Note</span>
                    <strong>Important state-specific rules</strong>
                    <small>{s.specialNotes}</small>
                  </div>
                )}
              </div>
            )}
            {s.taxType !== "none" && s.bracketBreakdown.length > 0 && (
              <>
                <div className="portfolio-section-title" style={{ marginTop: 16 }}>State Bracket Breakdown</div>
                <div className="comparison-grid">
                  {s.bracketBreakdown.map((row, i) => (
                    <div key={i} className="comparison-card">
                      <span>{row.bracket} state bracket</span>
                      <strong>{fmt(row.income)} → {fmt(row.tax)}</strong>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* ── WHAT-IF SCENARIO TAB ── */}
      {activeTab === "scenario" && (
        <>
          <div className="portfolio-section">
            <div className="portfolio-section-title">What-If Scenario — Modify Income to See Tax Impact</div>
            <div className="portfolio-summary-card">
              <span>How it works</span>
              <strong>Enter scenario values below — the calculation shows how the change affects total tax</strong>
              <small>Leave blank to keep the same as the base case. Use this to model: additional IRA distribution, Roth conversion, capital gain realization, or income reduction.</small>
            </div>
            <div className="comparison-grid">
              {INCOME_FIELDS.map(field => {
                const baseVal = (ic[field.key] as number) ?? 0;
                return (
                  <div key={field.key} className="comparison-card">
                    <span style={{ fontSize: 11 }}>Scenario: {field.label}</span>
                    <strong style={{ fontSize: 11 }}>Base: {fmt(Math.round(baseVal))}</strong>
                    <input
                      type="text"
                      className="manager-input"
                      placeholder="Leave blank = same as base"
                      value={scenarioOverrides[field.key] ?? ""}
                      onChange={e => handleScenarioChange(field.key, e.target.value)}
                      style={{ marginTop: 4, width: "100%" }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          {scenarioCalc && (
            <div className="portfolio-section">
              <div className="portfolio-section-title">Scenario Results</div>
              <div className="comparison-grid">
                {[
                  { label: "Gross income", base: f.grossIncome, scen: scenarioCalc.federal.grossIncome },
                  { label: "AGI", base: f.adjustedGrossIncome, scen: scenarioCalc.federal.adjustedGrossIncome },
                  { label: "Taxable income", base: f.taxableIncome, scen: scenarioCalc.federal.taxableIncome },
                  { label: "Federal tax", base: f.totalFederalTax, scen: scenarioCalc.federal.totalFederalTax },
                  { label: "State tax", base: s?.stateTax ?? 0, scen: scenarioCalc.state?.stateTax ?? 0 },
                  { label: "Total tax", base: baseCalc.combinedTotalTax, scen: scenarioCalc.combinedTotalTax },
                  { label: "After-tax income", base: baseCalc.afterTaxIncome, scen: scenarioCalc.afterTaxIncome },
                ].map(row => {
                  const delta = row.scen - row.base;
                  return (
                    <div key={row.label} className="comparison-card">
                      <span>{row.label}</span>
                      <strong>
                        {fmt(row.base)} → {fmt(row.scen)}
                      </strong>
                      <small style={{ color: delta > 0 && row.label !== "After-tax income" ? "var(--color-text-danger, #dc3545)" : delta < 0 && row.label !== "After-tax income" ? "var(--color-text-success, #28a745)" : delta > 0 ? "var(--color-text-success, #28a745)" : "" }}>
                        {delta === 0 ? "No change" : delta > 0 ? `+${fmt(delta)}` : fmt(delta)}
                      </small>
                    </div>
                  );
                })}
                <div className="comparison-card" style={{ gridColumn: "1 / -1" }}>
                  <span>Effective rates — Base vs. Scenario</span>
                  <strong>
                    {pct(baseCalc.combinedEffectiveRate)} → {pct(scenarioCalc.combinedEffectiveRate)} combined effective
                  </strong>
                  <small>
                    Marginal: {pct(baseCalc.combinedMarginalRate)} → {pct(scenarioCalc.combinedMarginalRate)}
                  </small>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── STATE COMPARISON TAB ── */}
      {activeTab === "comparison" && (
        <div className="portfolio-section">
          <div className="portfolio-section-title">State Tax Comparison — Same Income Across 12 States</div>
          <div className="portfolio-summary-card">
            <span>Federal tax is identical in every state</span>
            <strong>{fmt(f.totalFederalTax)} federal | AGI: {fmt(f.adjustedGrossIncome)}</strong>
            <small>The table below shows how state of residence changes combined total tax liability for the same income profile.</small>
          </div>
          <div className="comparison-grid">
            {[
              "CA", "NY", "NJ", "OR", "MN", "WI",   // High-tax states
              "TX", "FL", "NV", "WA", "SD", "WY"    // No-tax states
            ].map(code => {
              const profile = getStateTaxProfile(code);
              if (!profile || !activeClient) return null;
              // Quick state tax calculation using the same AGI
              let stateT = 0;
              if (profile.type === "flat" && profile.flatRate) {
                const filing = baseCalc.filingStatus;
                const ded = (filing === "mfj" ? profile.standardDeduction.mfj : profile.standardDeduction.single) +
                            (filing === "mfj" ? profile.personalExemption.mfj : profile.personalExemption.single);
                const sti = Math.max(0, f.adjustedGrossIncome - ded);
                stateT = Math.round(sti * profile.flatRate);
              } else if (profile.type === "graduated" && profile.brackets) {
                const filing = baseCalc.filingStatus;
                const ded = (filing === "mfj" ? profile.standardDeduction.mfj : profile.standardDeduction.single) +
                            (filing === "mfj" ? profile.personalExemption.mfj : profile.personalExemption.single);
                const sti = Math.max(0, f.adjustedGrossIncome - ded);
                const bkts = filing === "mfj" ? profile.brackets.mfj : profile.brackets.single;
                let prev = 0;
                for (const b of bkts) {
                  if (sti <= prev) break;
                  stateT += (Math.min(sti, b.upTo) - prev) * b.rate;
                  prev = b.upTo;
                  if (sti <= b.upTo) break;
                }
                stateT = Math.round(stateT);
              }
              const combined = f.totalFederalTax + stateT;
              const effectiveCombined = f.grossIncome > 0 ? combined / f.grossIncome : 0;
              return (
                <div key={code} className={`comparison-card ${code === selectedState ? "decision-correct" : ""}`}>
                  <span>{profile.name}{code === selectedState ? " ← current" : ""}</span>
                  <strong>State: {profile.type === "none" ? "$0" : fmt(stateT)} | Total: {fmt(combined)}</strong>
                  <small>
                    {profile.type === "none"
                      ? "No state tax — saves " + fmt(Math.max(0, s?.stateTax ?? 0 - stateT)) + " vs. " + selectedState
                      : `Combined effective: ${shortPct(effectiveCombined)} | State marginal: ${shortPct(profile.topMarginalRate)}`}
                  </small>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </section>
  );
}

// Export NIIT_RATE for use in the federal detail tab
const NIIT_RATE = 0.038;
