/**
 * windowSlice.ts
 * Standalone Zustand slice for the desktop window manager.
 * This file is ONLY imported by DesktopShell and WindowFrame.
 * It has zero dependencies on gameStore.ts or any engine/data file.
 */

import { create } from "zustand";

export type WindowId = string;

export interface WindowState {
  id: WindowId;
  title: string;
  /** Component key used to resolve what renders inside the window */
  componentKey: string;
  /** Props forwarded to the inner component */
  componentProps?: Record<string, unknown>;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  /** Icon path shown in titlebar and taskbar */
  iconSrc?: string;
}

export interface DesktopIconDef {
  id: string;
  label: string;
  iconSrc?: string;
  /** Which window to open when double-clicked */
  opensWindow: Omit<WindowState, "id" | "zIndex" | "isMinimized" | "isMaximized">;
}

interface WindowStore {
  windows: WindowState[];
  topZ: number;

  openWindow: (def: Omit<WindowState, "id" | "zIndex" | "isMinimized" | "isMaximized">) => WindowId;
  closeWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  unmaximizeWindow: (id: WindowId) => void;
  moveWindow: (id: WindowId, x: number, y: number) => void;
  resizeWindow: (id: WindowId, width: number, height: number, x: number, y: number) => void;
  updateWindowComponentProps: (id: WindowId, componentProps: Record<string, unknown>) => void;
}

let nextId = 1;

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  topZ: 100,

  openWindow: (def) => {
    const id = `win-${nextId++}`;
    const topZ = get().topZ + 1;
    set((state) => ({
      topZ,
      windows: [
        ...state.windows,
        {
          ...def,
          id,
          zIndex: topZ,
          isMinimized: false,
          isMaximized: false,
        },
      ],
    }));
    return id;
  },

  closeWindow: (id) =>
    set((state) => ({ windows: state.windows.filter((w) => w.id !== id) })),

  focusWindow: (id) => {
    const topZ = get().topZ + 1;
    set((state) => ({
      topZ,
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: topZ, isMinimized: false } : w
      ),
    }));
  },

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
    })),

  restoreWindow: (id) => {
    const topZ = get().topZ + 1;
    set((state) => ({
      topZ,
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: false, zIndex: topZ } : w
      ),
    }));
  },

  maximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: true } : w
      ),
    })),

  unmaximizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: false } : w
      ),
    })),

  moveWindow: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  resizeWindow: (id, width, height, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, width, height, x, y } : w
      ),
    })),

  updateWindowComponentProps: (id, componentProps) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, componentProps: { ...(w.componentProps ?? {}), ...componentProps } }
          : w
      ),
    })),
}));
