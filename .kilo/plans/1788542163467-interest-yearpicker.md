# Interest YearPicker Implementation Plan

## Goal
Add a PrimeVue Calendar (YearPicker mode) dropdown on the account detail page so users can select a year to view interest data, defaulting to the current year.

## Affected Files

### 1. `web-client/plugins/primevue.ts`
Register the `Calendar` component (not yet imported).

### 2. `web-client/services/account.ts` (`interestPerYearService`)
Accept an optional `year?: number` parameter and pass it as an ofetch `query` param (`{ year }`), matching the existing pattern in `services/report.ts`.

### 3. `web-client/pages/account/[id].vue`
Three changes:

**Script:**
- Add `selectedYear` ref: `const selectedYear = ref(new Date())` — a `Date` object for Calendar v-model, defaulting to today (= current year).
- Add a `watch` on `selectedYear` that re-calls `getInterestPerYear(+id, selectedYear.value.getFullYear())`.
- Update `getInterestPerYear` signature to accept and pass year to the service.
- Update the `init()` call at line 240 to pass `selectedYear.value.getFullYear()`.

**Template (around line 354-360):**
- Insert a `<Calendar>` component in `year` picker mode next to the interest summary card.
- Change label from `"ดอกเบี้ยปีนี้"` to `"ดอกเบี้ยปี"` (removing "นี้" since year is no longer fixed to current).

## Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| Year format | Gregorian (e.g., 2026) | Backend `QueryIntersetDto`/`dateFrom1AugAgoTo31Jul` expects Gregorian |
| Calendar v-model type | `Date` object | PrimeVue Calendar uses Date for v-model; extract year via `.getFullYear()` |
| Default year | Current year (`new Date()`) | Matches `"เป็นปีปัจจุบัน"` requirement |
| Re-fetch trigger | `watch` on `selectedYear` | Ensures data updates when user picks a different year |
| No year range constraint | Omit `minDate`/`maxDate` | Backend accepts any year; no business-rule enforced range in current backend |
| UI placement | Next to the interest summary card, inline | Minimal layout change; keeps related elements together |

## Files Changed (Summary)

- `web-client/plugins/primevue.ts` — +1 import, +1 component registration
- `web-client/services/account.ts` — modify `interestPerYearService` signature + add `query` param
- `web-client/pages/account/[id].vue` — +3 script sections, +1 template addition, 1 label change