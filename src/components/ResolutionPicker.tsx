import { useEffect, useState } from "react";

type ResolutionBridgeWindow = Window & {
  electronAPI?: {
    setResolution: (width: number | null, height: number | null) => Promise<void>;
  };
};

// Resolution options — shown in the dropdown for user reference.
// Layout fills the viewport natively via CSS; selecting a resolution
// stores the preference and sets a data-resolution attribute on <body>
// so CSS media/container queries can respond if needed.
const RESOLUTION_LABELS: string[] = [
  "800 × 600  (SVGA)",
  "1024 × 600 (WSVGA)",
  "1024 × 768 (XGA)",          // Minimum supported
  "1152 × 864 (XGA+)",
  "1280 × 720 (HD 720p)",
  "1280 × 768 (WXGA)",
  "1280 × 800 (WXGA)",
  "1280 × 960 (SXGA−)",
  "1280 × 1024 (SXGA)",
  "1360 × 768 (HD)",
  "1366 × 768 (HD)",
  "1400 × 1050 (SXGA+)",
  "1440 × 900 (WXGA+)",
  "1440 × 1080 (HDV)",
  "1600 × 900 (HD+)",
  "1600 × 1024 (WSXGA)",
  "1600 × 1200 (UXGA)",
  "1680 × 1050 (WSXGA+)",
  "1920 × 1080 (FHD 1080p)",   // Design baseline
  "1920 × 1200 (WUXGA)",
  "1920 × 1440 (UXGA wide)",
  "2048 × 1080 (DCI 2K)",
  "2048 × 1152 (QWXGA)",
  "2160 × 1440 (Surface)",
  "2256 × 1504 (Surface Pro)",
  "2304 × 1440 (MacBook)",
  "2560 × 1080 (UW FHD)",
  "2560 × 1440 (QHD 1440p)",
  "2560 × 1600 (WQXGA)",
  "2560 × 2048 (QSXGA)",
  "2736 × 1824 (Surface Pro)",
  "2880 × 1800 (MacBook Pro)",
  "3200 × 1800 (QHD+)",
  "3440 × 1440 (UW QHD)",
  "3840 × 1600 (UW 4K)",
  "3840 × 2160 (4K UHD)",
];

const STORAGE_KEY = "fd-resolution";

function parseResolution(label: string | null) {
  if (!label || label === "Auto") {
    return null;
  }

  const match = label.match(/(\d+)\D+(\d+)/);
  if (!match) {
    return null;
  }

  return {
    width: Number(match[1]),
    height: Number(match[2])
  };
}

export function ResolutionPicker() {
  const [selected, setSelected] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) ?? "Auto"
  );

  useEffect(() => {
    const parsed = parseResolution(selected);

    if (selected === "Auto") {
      localStorage.removeItem(STORAGE_KEY);
      void (window as ResolutionBridgeWindow).electronAPI?.setResolution(null, null);
      return;
    }

    localStorage.setItem(STORAGE_KEY, selected);
    if (parsed) {
      void (window as ResolutionBridgeWindow).electronAPI?.setResolution(parsed.width, parsed.height);
    }
  }, [selected]);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const label = e.target.value;
    setSelected(label);
  }

  return (
    <select
      className="control-btn resolution-select"
      value={selected}
      onChange={handleChange}
      title="Display resolution reference"
    >
      <option value="Auto">⊞ Resolution: Auto</option>
      <optgroup label="──────────────────">
        {RESOLUTION_LABELS.map((label) => (
          <option key={label} value={label}>{label}</option>
        ))}
      </optgroup>
    </select>
  );
}
