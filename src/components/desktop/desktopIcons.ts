import type { DesktopIconDef } from "../../store/windowSlice";

export const DESKTOP_ICONS: DesktopIconDef[] = [
  {
    id: "recycle-bin",
    label: "Recycle Bin",
    opensWindow: {
      title: "Recycle Bin",
      componentKey: "recycle-bin",
      x: 200,
      y: 100,
      width: 480,
      height: 320,
      minWidth: 300,
      minHeight: 200,
    },
  },
  {
    id: "email",
    label: "Email",
    opensWindow: {
      title: "Email",
      componentKey: "active-phishing-workspace",
      x: 60,
      y: 60,
      width: 900,
      height: 600,
      minWidth: 600,
      minHeight: 400,
    },
  },
  {
    id: "logout",
    label: "Logout",
    opensWindow: {
      title: "__logout__",
      componentKey: "__logout__",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      minWidth: 0,
      minHeight: 0,
    },
  },
];
