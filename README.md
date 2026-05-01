# Fiduciary Duty

A financial exam study platform and training simulator for securities and advisory professionals.

Fiduciary Duty is an Electron desktop training application for practicing client suitability, market analysis, and exam-style financial planning questions in a realistic workstation interface. It is designed for learners working through entry-to-advanced securities and advisory concepts, including SIE, Series 7, Series 65, and Series 66 content.

## Project Structure

- `electron` — Electron main and preload processes, LAN bridge server
- `renderer` — Vite React entrypoint and global styles
- `src/components` — UI components for the training workstation
- `src/data` — Question banks and seeded client data
- `src/engine` — Market, compliance, question, tax, and curriculum engines
- `src/store` — Zustand game store, single source of truth for application state
- `src/types` — Shared TypeScript interfaces

## Running Locally via Command Prompt

1. Install dependencies with `npm install`
2. Start the Vite + Electron dev workflow with `npm run dev`
3. Run `npm run test` for TypeScript verification
4. Run `npm run dist` to build desktop installers locally without publishing updates
5. Run `npm run dist:publish` only when a real update feed and release process are ready

## Running Locally via Installation
1. Download from Fiduciary Duty Setup 1.0.0.exe from Release Folder <you must click View Raw for download to proceed>
2. Install via Fiduciary Duty Setup 1.0.0.exe. You will need to Click More Info > Run Anyway and then relaunch the launcher if it doesnt load immediately>
3. Make sure to change the install location to the appropriate drive of your choosing not AppData
4. Upon first login, user must access Manager Workstation to add "employees" and assign modules
5. Username: admin. Password: Admin01. You will also need an authenticator to get into the Manager Workstation

## LAN Setup

The Manager PC starts a LAN host from the Manager Dashboard. Trainee PCs connect to the Manager PC by IP and token. Trainee PCs do not communicate with each other — all traffic flows to the Manager PC only.

## Usage

The developer of Fiduciary Duty hereby authorizes the following uses of this application, free of charge:

- Personal use for study, exam preparation, and training
- Sharing the application with friends, family, and coworkers
- Distribution within educational or professional organizations for non-commercial purposes
- Demonstration and evaluation of the platform

## Restrictions

The following are strictly prohibited without express written consent from the developer:

- Selling, licensing, or monetizing the underlying source code in any form
- Selling, licensing, or monetizing the visual design, UI components, or assets
- Repackaging or redistributing this application as a commercial product
- Incorporating the source code or visuals into any paid product or service
- Claiming ownership or authorship of this work

## License

Copyright © 2026. All rights reserved. This software is provided free of charge for personal and non-commercial use. No open source license is granted. The source code, visual design, and all associated assets remain the exclusive intellectual property of the developer. Unauthorized commercial use will be pursued to the fullest extent permitted by law.

Exceptions to this license have been made for Handshake Inc, OpenAI and its affiliates, and Stryder Corp. They are permitted a global, irrevocable, perpetual, royalty-free license to reproduce, publicly display, distribute, and use the material contained therein to promote OpenAI Codex as well as their Creator Challenge. This exception is limited strictly to promotional use in connection with the OpenAI Codex Creator Challenge and does not extend to any other commercial purpose, including selling the coding contained therein. That remains the exclusive property of the creator.

## Contact

For licensing inquiries or permissions beyond the scope of this notice, contact: josh.popchoke@gmail.com
