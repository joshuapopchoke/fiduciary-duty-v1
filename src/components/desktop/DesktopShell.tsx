import { Suspense, useCallback, useRef } from "react";
import type { TelemetryPayload } from "./TelemetryContext";
import { TelemetryContext } from "./TelemetryContext";
import type { DesktopIconDef } from "../../store/windowSlice";
import { useWindowStore } from "../../store/windowSlice";
import { DesktopIcon } from "./DesktopIcon";
import { Taskbar } from "./Taskbar";
import { WindowFrame } from "./WindowFrame";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ModuleRegistry = Record<string, React.ComponentType<any>>;

interface DesktopShellProps {
  moduleRegistry: ModuleRegistry;
  desktopIcons: DesktopIconDef[];
  onLogout?: () => void;
  onTelemetryChange?: (telemetry: TelemetryPayload) => void;
  onMainMenu?: () => void;
  showCmdPrompt?: boolean;
  onOpenCmdPrompt?: () => void;
}

const TASKBAR_HEIGHT = 40;

export function DesktopShell({ moduleRegistry, desktopIcons, onLogout, onTelemetryChange, onMainMenu, showCmdPrompt, onOpenCmdPrompt }: DesktopShellProps) {
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);
  const updateWindowComponentProps = useWindowStore((s) => s.updateWindowComponentProps);
  const desktopRef = useRef<HTMLDivElement>(null);

  const stableTelemetry = useCallback((telemetry: TelemetryPayload) => {
    onTelemetryChange?.(telemetry);
  }, [onTelemetryChange]);

  const getDesktopBounds = useCallback(() => {
    if (!desktopRef.current) return { width: 1280, height: 720 - TASKBAR_HEIGHT };
    const rect = desktopRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, []);

  function handleIconOpen(iconId: string) {
    // Logout icon — go to main menu, not full logout
    if (iconId === "logout") {
      onMainMenu?.();
      return;
    }

    const def = desktopIcons.find((d) => d.id === iconId);
    if (!def) return;

    const alreadyOpen = windows.find((w) => w.componentKey === def.opensWindow.componentKey);
    if (alreadyOpen) {
      if (def.opensWindow.componentProps) {
        updateWindowComponentProps(alreadyOpen.id, def.opensWindow.componentProps);
      }
      useWindowStore.getState().focusWindow(alreadyOpen.id);
      return;
    }
    openWindow(def.opensWindow);
  }

  return (
    <TelemetryContext.Provider value={stableTelemetry}>
      <div className="ds-root">
        <div className="ds-surface" ref={desktopRef}>
          <div className="ds-icon-grid">
            {desktopIcons.map((icon) => (
              <DesktopIcon
                key={icon.id}
                id={icon.id}
                label={icon.label}
                iconSrc={icon.iconSrc}
                onOpen={handleIconOpen}
              />
            ))}
          </div>

          {windows.map((win) => {
            const Component = moduleRegistry[win.componentKey];
            const bounds = getDesktopBounds();
            return (
              <WindowFrame key={win.id} window={win} desktopBounds={bounds}>
                <Suspense fallback={<div style={{ padding: 24, color: "var(--muted)" }}>Loading...</div>}>
                  {Component
                    ? <Component {...(win.componentProps ?? {})} />
                    : <UnknownModule componentKey={win.componentKey} />
                  }
                </Suspense>
              </WindowFrame>
            );
          })}
        </div>

        <Taskbar
          onMainMenu={onMainMenu}
          onLogout={onLogout}
          showCmdPrompt={showCmdPrompt}
          onOpenCmdPrompt={onOpenCmdPrompt}
        />
      </div>
    </TelemetryContext.Provider>
  );
}

function UnknownModule({ componentKey }: { componentKey: string }) {
  return (
    <div style={{ padding: 24, color: "var(--red)" }}>
      No module registered for key: <code>{componentKey}</code>
    </div>
  );
}
