/**
 * DesktopIcon.tsx
 * Single icon on the desktop surface.
 * Double-click opens the associated window.
 * Supports a notification badge (e.g. unread email count).
 */

import { useRef } from "react";

interface DesktopIconProps {
  id: string;
  label: string;
  iconSrc?: string;
  badgeCount?: number;
  onOpen: (id: string) => void;
}

export function DesktopIcon({ id, label, iconSrc, badgeCount, onOpen }: DesktopIconProps) {
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCount = useRef(0);

  function handleClick() {
    clickCount.current += 1;
    if (clickCount.current === 1) {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 300);
    } else if (clickCount.current === 2) {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickCount.current = 0;
      onOpen(id);
    }
  }

  return (
    <button
      className="di-root"
      onClick={handleClick}
      title={`Double-click to open ${label}`}
      type="button"
    >
      <div className="di-icon-wrap">
        {iconSrc
          ? <img className="di-img" src={iconSrc} alt={label} />
          : <div className="di-img di-img--fallback">{label.charAt(0)}</div>
        }
        {badgeCount != null && badgeCount > 0 && (
          <span className="di-badge">{badgeCount > 99 ? "99+" : badgeCount}</span>
        )}
      </div>
      <span className="di-label">{label}</span>
    </button>
  );
}
