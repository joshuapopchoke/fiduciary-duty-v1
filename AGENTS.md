# Agent Guide

## Build & Test
- Build command: `npm run build`
- Test command: `npm run test`

## Hard Rules — Read Before Every Task

These are not suggestions. Violating any of these is an automatic failure regardless of whether the output "works."

- Do exactly what the instruction says. No more. No less. Do not anticipate the next step.
- Do not refactor, reorganize, or "clean up" existing code unless explicitly told to.
- Do not modify any existing file unless the instruction explicitly names that file.
- Do not rename, move, or delete any existing file or directory.
- After completing each instruction, stop and report exactly what files were created or modified and why. Do not proceed to the next step automatically.
- Do not add packages to package.json without explicit instruction. The one exception is `react-rnd` which is pre-approved for the desktop shell phase.

## Protected Files — Do Not Touch Without Explicit Instruction

The following files must never be modified unless the instruction explicitly names them:

- `src/store/gameStore.ts`
- `src/types/gameState.ts`
- `src/types/client.ts`
- `src/types/market.ts`
- `src/types/question.ts`
- `src/engine/*` (all engine files)
- `src/data/*` (all data files)
- `src/index.html`
- `src/components/EmployeeAppView.tsx`
- `src/components/EmployeeModuleWorkspace.tsx`
- `src/components/LoginScreen.tsx`
- `src/components/ModuleSelectionScreen.tsx`
- `src/components/TopBar.tsx`
- `electron/main.ts`
- `dist/electron/main.js`
- `vite.config.ts`
- `tsconfig.json`
- `package-lock.json`

## Desktop Shell Phase — Architecture

The desktop shell is a new rendering layer that sits between ModuleSelectionScreen and EmployeeAppView. It does NOT replace any existing component. Modules will eventually open as windows inside it. That wiring happens in a later phase — not now.

### Files already created — copy into repo, do not recreate or modify unless instructed

| File | Destination in repo |
|------|---------------------|
| `windowSlice.ts` | `src/store/windowSlice.ts` |
| `DesktopShell.tsx` | `src/components/desktop/DesktopShell.tsx` |
| `WindowFrame.tsx` | `src/components/desktop/WindowFrame.tsx` |
| `DesktopIcon.tsx` | `src/components/desktop/DesktopIcon.tsx` |
| `Taskbar.tsx` | `src/components/desktop/Taskbar.tsx` |
| `desktop.css` | `renderer/desktop.css` |

### Wiring instructions (execute only when told "wire the desktop shell")
1. Add `react-rnd` to package.json dependencies
2. Add `@import './desktop.css';` to the top of `renderer/styles.css`
3. In `src/components/EmployeeAppView.tsx`: import DesktopShell and wrap the active module workspace render in it — do not remove or alter any existing logic
4. Stop and report before doing anything else

### MODULE_REGISTRY pattern
Defined in `src/components/desktop/moduleRegistry.ts`. Maps string keys to lazy-loaded components. Add modules one at a time only when explicitly instructed.

### DESKTOP_ICONS pattern
Defined in `src/components/desktop/desktopIcons.ts`. Static array of DesktopIconDef objects. Add icons only when explicitly instructed.

## Step-by-step instruction protocol
Instructions will be given one at a time. Complete only the named step. Stop. Report what changed and why. Wait for the next instruction. Do not chain steps.

## Existing Code Standards
- React components use PascalCase file names, one component per file, under `src/components/`
- All new questions must conform to the Question interface in `src/types/question.ts`
- Every new question must include a substantive explanation field with at least two full sentences
- Compliance engine logic must never change question scoring
- Question engine logic must never change SEC scrutiny calculations
