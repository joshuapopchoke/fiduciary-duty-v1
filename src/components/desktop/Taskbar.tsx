/**
 * Taskbar.tsx
 * Bottom taskbar. Shows open/minimized windows as buttons.
 * Clicking a minimized window restores it. Clicking an active window minimizes it.
 * Right side: clock, notification area.
 */

import { useEffect, useState } from "react";
import type { WindowState } from "../../store/windowSlice";
import { useWindowStore } from "../../store/windowSlice";

interface TaskbarProps {
  onMainMenu?: () => void;
  onLogout?: () => void;
  showCmdPrompt?: boolean;
  onOpenCmdPrompt?: () => void;
}

export function Taskbar({ onMainMenu, onLogout, showCmdPrompt = false, onOpenCmdPrompt }: TaskbarProps) {
  const windows = useWindowStore((s) => s.windows);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const topZ = useWindowStore((s) => s.topZ);

  const [time, setTime] = useState(() => formatTime(new Date()));
  const [date, setDate] = useState(() => formatDate(new Date()));

  useEffect(() => {
    const tick = setInterval(() => {
      const now = new Date();
      setTime(formatTime(now));
      setDate(formatDate(now));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  function handleTaskbarButton(win: WindowState) {
    if (win.isMinimized) {
      restoreWindow(win.id);
    } else if (win.zIndex === topZ) {
      minimizeWindow(win.id);
    } else {
      focusWindow(win.id);
    }
  }

  return (
    <div className="tb-root">
      <button className="tb-start" onClick={onMainMenu} type="button" title="Main Menu">
        <span className="tb-start-label">FD</span>
      </button>

      {showCmdPrompt ? (
        <button className="tb-start" onClick={onOpenCmdPrompt} type="button" title="Command Prompt">
          <span className="tb-start-label">CMD</span>
        </button>
      ) : null}

      {onLogout ? (
        <button className="tb-start" onClick={onLogout} type="button" title="EXIT">
          <span className="tb-start-label">EXIT</span>
        </button>
      ) : null}

      <div className="tb-windows">
        {windows.map((win) => (
          <button
            key={win.id}
            className={`tb-window-btn${win.zIndex === topZ && !win.isMinimized ? " tb-window-btn--active" : ""}${win.isMinimized ? " tb-window-btn--minimized" : ""}`}
            onClick={() => handleTaskbarButton(win)}
            type="button"
            title={win.title}
          >
            {win.iconSrc && <img className="tb-win-icon" src={win.iconSrc} alt="" />}
            <span className="tb-win-label">{win.title}</span>
          </button>
        ))}
      </div>

      <div className="tb-tray">
        <div className="tb-clock">
          <span className="tb-time">{time}</span>
          <span className="tb-date">{date}</span>
        </div>
      </div>
    </div>
  );
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
}
