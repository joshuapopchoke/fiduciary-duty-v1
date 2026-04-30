# Fiduciary Duty Manual QA Checklist

## First Run
- Launch with `npm run dev`.
- Confirm the onboarding overlay appears only before the first answered question.
- Dismiss onboarding and verify it does not reappear every screen refresh.

## Difficulty and Session Flow
- Start in `Learner`, answer at least one question, place one trade, then switch to `Easy`.
- Verify `Easy` opens its own session state rather than wiping or copying `Learner`.
- Switch back to `Learner` and confirm prior progress is still there.
- Use `New Session` and verify only the current difficulty resets.

## Save Slots
- Rename a slot, save into it, and verify the custom name remains after saving.
- Load the slot and verify score, timer, client book, and player book restore correctly.
- Export slots, then import the exported file.
- Try importing an invalid JSON file and confirm the app shows an import-failed warning instead of breaking.

## Question Flow
- Select each client and confirm a question draws successfully.
- Answer both correctly and incorrectly at least once in each active difficulty.
- Verify streak, best streak, domain accuracy, and adaptive-focus messaging update.
- Confirm the explanation and answer summary render after each answer.

## Client Gameplay
- Place clearly suitable trades and confirm trust/mandate fit improve.
- Place clearly unsuitable trades and confirm trust/mandate fit worsen.
- Run multiple 15-minute cycles and verify cycle recap shows client pulse.
- Confirm a severely neglected client can leave the book and that the recap reports it.

## Player Compliance
- Trigger legal insider scenarios and confirm both trade and stand-down outcomes behave sensibly.
- Trigger illegal insider scenarios and confirm fines, suspension, and eventual game-over escalation.
- Verify the player account cannot trade while suspended or incarcerated.

## Market and Research
- Click through every asset category: equities, funds, fixed income, bonds, forex, commodities, futures.
- Open `Overview`, `Income Statement`, `Balance Sheet`, and `Cash Flows` where applicable.
- Confirm no research tab crashes and quote-tape/event-lens fields render.
- Verify prices and charts only change on the 15-minute refresh cycle.

## Portfolio and Order Entry
- Buy and sell in the player account and client accounts.
- Attempt to overbuy and oversell both player and client accounts and confirm clean warnings appear.
- Confirm portfolio rows and unrealized P/L update correctly after market refreshes.

## Audits and End Session
- Trigger an SEC audit and confirm the overlay works end to end.
- Fail and pass audits to confirm scrutiny reset behavior.
- Let a session end and verify the session-end screen shows score, USD, accuracy, best streak, and breakdown rows.
- Dismiss the end screen and confirm the app remains usable.

## Packaging and Security
- Run `npm run test`.
- Run `npm run build`.
- Run `npm run dist` and verify local packaging begins without trying to publish automatically.
