/**
 * WindowFrame.tsx
 * Draggable, resizable window shell.
 * Wraps any module panel. Has no knowledge of what renders inside it.
 *
 * Dependencies: react-rnd (must be added to package.json)
 */

import { useCallback } from "react";
import { Rnd } from "react-rnd";
import type { WindowState } from "../../store/windowSlice";
import { useWindowStore } from "../../store/windowSlice";

interface WindowFrameProps {
  window: WindowState;
  children: React.ReactNode;
  /** Bounding rect of the desktop surface (not full screen — excludes taskbar) */
  desktopBounds: { width: number; height: number };
}

export function WindowFrame({ window: win, children, desktopBounds }: WindowFrameProps) {
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow);
  const unmaximizeWindow = useWindowStore((s) => s.unmaximizeWindow);
  const moveWindow = useWindowStore((s) => s.moveWindow);
  const resizeWindow = useWindowStore((s) => s.resizeWindow);

  const handleFocus = useCallback(() => focusWindow(win.id), [focusWindow, win.id]);
  const handleClose = useCallback(
    (e: React.MouseEvent) => { e.stopPropagation(); closeWindow(win.id); },
    [closeWindow, win.id]
  );
  const handleMinimize = useCallback(
    (e: React.MouseEvent) => { e.stopPropagation(); minimizeWindow(win.id); },
    [minimizeWindow, win.id]
  );
  const handleMaximizeToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (win.isMaximized) {
        unmaximizeWindow(win.id);
      } else {
        maximizeWindow(win.id);
      }
    },
    [win.id, win.isMaximized, maximizeWindow, unmaximizeWindow]
  );

  if (win.isMinimized) return null;

  const position = win.isMaximized ? { x: 0, y: 0 } : { x: win.x, y: win.y };
  const size = win.isMaximized
    ? { width: desktopBounds.width, height: desktopBounds.height }
    : { width: win.width, height: win.height };

  return (
    <Rnd
      size={size}
      position={position}
      minWidth={win.minWidth}
      minHeight={win.minHeight}
      bounds="parent"
      dragHandleClassName="wf-titlebar"
      disableDragging={win.isMaximized}
      enableResizing={!win.isMaximized}
      style={{ zIndex: win.zIndex, position: "absolute" }}
      onMouseDown={handleFocus}
      onDragStop={(_e, d) => moveWindow(win.id, d.x, d.y)}
      onResizeStop={(_e, _dir, ref, _delta, pos) =>
        resizeWindow(
          win.id,
          parseInt(ref.style.width, 10),
          parseInt(ref.style.height, 10),
          pos.x,
          pos.y
        )
      }
    >
      <div className={`wf-shell${win.isMaximized ? ' wf-maximized' : ''}`} style={{ width: "100%", height: "100%" }}>
        <TitleBar
          title={win.title}
          iconSrc={win.iconSrc}
          isMaximized={win.isMaximized}
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximizeToggle={handleMaximizeToggle}
        />
        <div className="wf-body">{children}</div>
      </div>
    </Rnd>
  );
}

interface TitleBarProps {
  title: string;
  iconSrc?: string;
  isMaximized: boolean;
  onClose: (e: React.MouseEvent) => void;
  onMinimize: (e: React.MouseEvent) => void;
  onMaximizeToggle: (e: React.MouseEvent) => void;
}

function TitleBar({ title, iconSrc, isMaximized, onClose, onMinimize, onMaximizeToggle }: TitleBarProps) {
  return (
    <div className="wf-titlebar">
      <div className="wf-titlebar-left">
        {iconSrc && <img className="wf-icon" src={iconSrc} alt="" />}
        <span className="wf-title">{title}</span>
      </div>
      <div className="wf-titlebar-controls">
        <button className="wf-btn wf-minimize" onClick={onMinimize} title="Minimize">
          <span>─</span>
        </button>
        <button className="wf-btn wf-maximize" onClick={onMaximizeToggle} title={isMaximized ? "Restore" : "Maximize"}>
          <span>{isMaximized ? "❐" : "□"}</span>
        </button>
        <button className="wf-btn wf-close" onClick={onClose} title="Close">
          <span>✕</span>
        </button>
      </div>
    </div>
  );
}
