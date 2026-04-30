import { Suspense, lazy } from "react";
import type { AssignmentProgressSnapshot, ModuleScoreCard } from "../engine/trainingCurriculumEngine";
import { ClientRoster } from "./ClientRoster";
import { MarketChart } from "./MarketChart";
import { OrderEntry } from "./OrderEntry";
import { QuestionPanel } from "./QuestionPanel";
import { MortgageDebtPlanningPanel } from "./MortgageDebtPlanningPanel";
import { BankLendingPanel } from "./BankLendingPanel";
import { PhishingForScamsPanel } from "./PhishingForScamsPanel";
import { ClientMeetingReadinessPanel } from "./ClientMeetingReadinessPanel";
import { TaxPlanningPanel } from "./TaxPlanningPanel";
import { InsurancePlanningPanel } from "./InsurancePlanningPanel";
import { EstatePlanningPanel } from "./EstatePlanningPanel";
import { QualifiedPlanPanel } from "./QualifiedPlanPanel";
import { MortgageContextPanel } from "./MortgageContextPanel";
import { LendingContextPanel } from "./LendingContextPanel";
import { RetirementPlanningPanel, RetirementSessionStrip, RetirementIpsReference } from "./RetirementPlanningPanel";
import { useGameStore } from "../store/gameStore";
import { SuitabilityNotificationWrapper } from "./SuitabilityNotificationWrapper";

const PortfolioPanel = lazy(() => import("./PortfolioPanel").then((module) => ({ default: module.PortfolioPanel })));
const ResearchTerminal = lazy(() => import("./ResearchTerminal").then((module) => ({ default: module.ResearchTerminal })));

interface EmployeeModuleWorkspaceProps {
  assignment: AssignmentProgressSnapshot;
  moduleScore: number;
  scoreCards: ModuleScoreCard[];
  answeredCount?: number;
  onModuleTelemetryChange?: (telemetry: {
    score: number;
    scoreCards: ModuleScoreCard[];
    answeredCount: number;
  }) => void;
}

interface ModuleBannerProps extends EmployeeModuleWorkspaceProps {
  compact?: boolean;
}

function ModuleBanner({ assignment, scoreCards, answeredCount = 0, compact = false }: ModuleBannerProps) {
  return (
    <section className={compact ? "panel module-banner module-banner--compact" : "panel module-banner"}>
      <div className="panel-header">
        <div className="side-panel-heading">
          <h2>{assignment.module.title}</h2>
          <span className="panel-meta">{assignment.module.focus}</span>
        </div>
      </div>
      <div className="study-summary-grid">
        <div className="study-summary-card">
          <span>Progress</span>
          <strong>{answeredCount} answered</strong>
          <small>{assignment.module.completionLabel}</small>
        </div>
        {scoreCards.map((card) => (
          <div key={card.label} className="study-summary-card">
            <span>{card.label}</span>
            <strong>{card.score >= 70 ? "✓ On track" : card.score >= 40 ? "△ Needs work" : card.score === 0 ? "— Not started" : "✗ Review needed"}</strong>
            <small>{assignment.module.coachingSignals.join(" | ")}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

export function EmployeeModuleWorkspace(props: EmployeeModuleWorkspaceProps) {
  const activeTab = useGameStore((state) => state.activeTab);
  const setTab = useGameStore((state) => state.setTab);
  const { assignment } = props;

  switch (assignment.module.workspace) {
    case "exam-foundations":
      return (
        <div className="module-layout module-layout--single">
          <ModuleBanner {...props} />
          <QuestionPanel />
        </div>
      );
    case "suitability-client-fit":
      return (
        <div className="module-layout module-layout--three">
          <ClientRoster />
          <div className="center-column center-column--module center-column--suitability">
            <SuitabilityNotificationWrapper assignment={assignment} onTelemetryChange={props.onModuleTelemetryChange}>
              <ModuleBanner {...props} compact />
              <MarketChart />
              <OrderEntry />
            </SuitabilityNotificationWrapper>
          </div>
          <section className="panel side-shell">
            <div className="panel-header">
              <div className="side-panel-heading">
                <h2>Suitability Monitor</h2>
                <span className="panel-meta">Client fit, sleeve totals, and suitability context</span>
              </div>
            </div>
            <Suspense fallback={<div className="empty-state">Loading panel...</div>}>
              <PortfolioPanel />
            </Suspense>
          </section>
        </div>
      );
    case "retirement-planning":
      return (
        <div className="module-layout module-layout--three">
          <ClientRoster />
          <div className="center-column center-column--module center-column--retirement">
            <ModuleBanner {...props} compact />
            <RetirementSessionStrip />
            <RetirementPlanningPanel />
          </div>
          <section className="panel side-shell">
            <div className="panel-header tabs">
              <div className="side-panel-heading">
                <h2>{activeTab === "research" ? "Retirement Research" : "Retirement Portfolio"}</h2>
                <span className="panel-meta">Wealth protection, tax sleeves, and planning context</span>
              </div>
              <div className="tabs">
                <button type="button" className={activeTab === "research" ? "tab-btn active" : "tab-btn"} onClick={() => setTab("research")}>Research</button>
                <button type="button" className={activeTab === "portfolio" ? "tab-btn active" : "tab-btn"} onClick={() => setTab("portfolio")}>Portfolio</button>
              </div>
            </div>
            <Suspense fallback={<div className="empty-state">Loading panel...</div>}>
              {activeTab === "research" ? <ResearchTerminal /> : (
                <div style={{ overflowY: "auto", flex: 1, minHeight: 0 }}>
                  <RetirementIpsReference />
                  <PortfolioPanel />
                </div>
              )}
            </Suspense>
          </section>
        </div>
      );
    case "mortgage-debt-planning":
      return (
        <div className="module-layout module-layout--three">
          <ClientRoster mode="mortgage" showPlayerAccount={false} />
          <div className="center-column center-column--module center-column--mortgage">
            <ModuleBanner {...props} compact />
            <MortgageDebtPlanningPanel assignment={assignment} assignedDifficulty={assignment.assignedDifficulty ?? "trainee"} />
          </div>
          <MortgageContextPanel />
        </div>
      );
    case "bank-lending":
      return (
        <div className="module-layout module-layout--three">
          <ClientRoster mode="lending" showPlayerAccount={false} />
          <div className="center-column center-column--module center-column--bank">
            <ModuleBanner {...props} compact />
            <BankLendingPanel assignment={assignment} onTelemetryChange={props.onModuleTelemetryChange} assignedDifficulty={assignment.assignedDifficulty ?? "trainee"} />
          </div>
          <LendingContextPanel />
        </div>
      );
    case "phishing-scams-trainee":
      return (
        <div className="module-layout module-layout--single">
          <ModuleBanner {...props} compact />
          <PhishingForScamsPanel
            variant="trainee"
            onTelemetryChange={props.onModuleTelemetryChange ?? (() => undefined)}
          />
        </div>
      );
    case "phishing-scams-it":
      return (
        <div className="module-layout module-layout--single">
          <ModuleBanner {...props} compact />
          <PhishingForScamsPanel
            variant="it"
            onTelemetryChange={props.onModuleTelemetryChange ?? (() => undefined)}
          />
        </div>
      );
    case "client-meeting-readiness":
      return (
        <div className="module-layout module-layout--single">
          <ModuleBanner {...props} />
          <ClientMeetingReadinessPanel onTelemetryChange={props.onModuleTelemetryChange ?? (() => undefined)} />
        </div>
      );
    case "tax-planning":
      return (
        <div className="module-layout module-layout--three">
          <ClientRoster />
          <div className="center-column center-column--module center-column--tax">
            <ModuleBanner {...props} compact />
            <TaxPlanningPanel onTelemetryChange={props.onModuleTelemetryChange} assignedDifficulty={assignment.assignedDifficulty ?? "trainee"} />
          </div>
          <section className="panel side-shell">
            <div className="panel-header">
              <div className="side-panel-heading">
                <h2>Tax Reference</h2>
                <span className="panel-meta">IRC 2024 brackets, limits, and planning context</span>
              </div>
            </div>
            <Suspense fallback={<div className="empty-state">Loading...</div>}>
              <PortfolioPanel />
            </Suspense>
          </section>
        </div>
      );
    case "insurance-planning":
      return (
        <div className="module-layout module-layout--three">
          <ClientRoster />
          <div className="center-column center-column--module center-column--insurance">
            <ModuleBanner {...props} compact />
            <InsurancePlanningPanel onTelemetryChange={props.onModuleTelemetryChange} assignedDifficulty={assignment.assignedDifficulty ?? "trainee"} />
          </div>
          <section className="panel side-shell">
            <div className="panel-header">
              <div className="side-panel-heading">
                <h2>Client Profile</h2>
                <span className="panel-meta">Coverage context and household profile</span>
              </div>
            </div>
            <Suspense fallback={<div className="empty-state">Loading...</div>}>
              <PortfolioPanel />
            </Suspense>
          </section>
        </div>
      );
    case "estate-planning":
      return (
        <div className="module-layout module-layout--three">
          <ClientRoster />
          <div className="center-column center-column--module center-column--estate">
            <ModuleBanner {...props} compact />
            <EstatePlanningPanel onTelemetryChange={props.onModuleTelemetryChange} assignedDifficulty={assignment.assignedDifficulty ?? "trainee"} />
          </div>
          <section className="panel side-shell">
            <div className="panel-header tabs">
              <div className="side-panel-heading">
                <h2>{activeTab === "research" ? "Estate Research" : "Estate Portfolio"}</h2>
                <span className="panel-meta">Wealth context and planning reference</span>
              </div>
              <div className="tabs">
                <button type="button" className={activeTab === "research" ? "tab-btn active" : "tab-btn"} onClick={() => setTab("research")}>Research</button>
                <button type="button" className={activeTab === "portfolio" ? "tab-btn active" : "tab-btn"} onClick={() => setTab("portfolio")}>Portfolio</button>
              </div>
            </div>
            <Suspense fallback={<div className="empty-state">Loading...</div>}>
              {activeTab === "research" ? <ResearchTerminal /> : <PortfolioPanel />}
            </Suspense>
          </section>
        </div>
      );
    case "qualified-plans":
      return (
        <div className="module-layout module-layout--three">
          <ClientRoster />
          <div className="center-column center-column--module center-column--qplan">
            <ModuleBanner {...props} compact />
            <QualifiedPlanPanel onTelemetryChange={props.onModuleTelemetryChange} assignedDifficulty={assignment.assignedDifficulty ?? "trainee"} />
          </div>
          <section className="panel side-shell">
            <div className="panel-header tabs">
              <div className="side-panel-heading">
                <h2>{activeTab === "research" ? "Plan Research" : "Retirement Portfolio"}</h2>
                <span className="panel-meta">Retirement context and plan reference</span>
              </div>
              <div className="tabs">
                <button type="button" className={activeTab === "research" ? "tab-btn active" : "tab-btn"} onClick={() => setTab("research")}>Research</button>
                <button type="button" className={activeTab === "portfolio" ? "tab-btn active" : "tab-btn"} onClick={() => setTab("portfolio")}>Portfolio</button>
              </div>
            </div>
            <Suspense fallback={<div className="empty-state">Loading...</div>}>
              {activeTab === "research" ? <ResearchTerminal /> : <PortfolioPanel />}
            </Suspense>
          </section>
        </div>
      );
    case "stock-game":
    default:
      return (
        <div className="module-layout module-layout--three">
          <ClientRoster />
          <div className="center-column">
            <ModuleBanner {...props} compact />
            <MarketChart />
            <QuestionPanel />
            <OrderEntry />
          </div>
          <section className="panel side-shell">
            <div className="panel-header tabs">
              <div className="side-panel-heading">
                <h2>{activeTab === "research" ? "Research Terminal" : "Portfolio Book"}</h2>
                <span className="panel-meta">{activeTab === "research" ? "Live quote context" : "Player and client holdings"}</span>
              </div>
              <div className="tabs">
                <button type="button" className={activeTab === "research" ? "tab-btn active" : "tab-btn"} onClick={() => setTab("research")}>
                  Research
                </button>
                <button type="button" className={activeTab === "portfolio" ? "tab-btn active" : "tab-btn"} onClick={() => setTab("portfolio")}>
                  Portfolio
                </button>
              </div>
            </div>
            <Suspense fallback={<div className="empty-state">Loading panel...</div>}>
              {activeTab === "research" ? <ResearchTerminal /> : <PortfolioPanel />}
            </Suspense>
          </section>
        </div>
      );
  }
}
