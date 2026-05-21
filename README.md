# Next to Go Races

## Project Overview

This project is a Vue 3 single-page application that consumes the Neds `nextraces` API and presents upcoming races with live countdowns, category filtering, and responsive race details. The visible list follows the core task rules by filtering invalid or expired races, sorting by advertised start time, and refetching larger result sets when needed to keep up to five races on screen.

## Features

- [x] Displays up to 5 visible races where valid data is available
- [x] Sorts races by `advertised_start.seconds` in ascending order
- [x] Removes races once they are more than 60 seconds past the advertised start time
- [x] Shows `meeting_name`
- [x] Shows `race_number`
- [x] Shows a live countdown timer for each race
- [x] Supports category filtering for Greyhound, Harness, and Horse racing
- [x] Supports combined category selection with an `All races` mode
- [x] Refills data incrementally when the current visible result is below 5 races
- [x] Includes loading, error, and empty states
- [x] Includes responsive desktop and mobile interaction patterns
- [x] Supports light and dark themes

## Tech Stack

- `Vue 3` - Component-based SPA UI.
- `TypeScript` - Typed API mapping, state, and business logic.
- `Vite` - Development server, production build pipeline, and local API proxy.
- `Pinia` - Central race store and UI state. It is registered in `src/main.ts`, defined in `src/stores/racesStore.ts`, and consumed from `src/App.vue`.
- `Tailwind CSS` - Utility-first styling and custom design tokens.
- `Vitest` - Unit testing for business logic and API mapping.
- `ESLint` - Linting for Vue and TypeScript code.
- `Prettier` - Code formatting.
- `PostCSS` - Tailwind and autoprefixer processing.
- `Lucide Vue` - Icon set used by the UI components.

## Getting Started

### Prerequisites

- Node.js
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Local URL

```txt
http://localhost:5173/
```

## API

- Endpoint: `GET https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=<count>`
- In local development, the app reaches the Neds API through the Vite proxy configured in `vite.config.ts`.
- The initial fetch starts at `count=10`.
- If the currently visible filtered result is below `5`, the store increases the fetch count in steps of `10` up to `80`.

At a high level, the API response is transformed as follows:

1. Invalid race entries are discarded.
2. Valid entries are mapped into typed `RaceSummary` objects.
3. The UI filters races by selected categories and expiry rules.
4. Remaining races are sorted by advertised start time.
5. The first `5` visible races are rendered.

## Testing

Run the current unit test suite with:

```bash
npm run test:unit
```

To run tests in watch mode during development:

```bash
npm run test:unit:watch
```

Current test coverage includes:

- sorting by `advertised_start`
- removing races after 60 seconds past the advertised start time
- filtering by selected categories
- `All categories` filter behavior
- limiting visible races to 5
- next upcoming race selection
- countdown formatting
- countdown state classification
- API response mapping, trimming, fallback values, and response ordering

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Builds the app for production |
| `npm run test:unit` | Runs the Vitest unit test suite |
| `npm run test:unit:watch` | Runs Vitest in watch mode during development |
| `npm run lint` | Runs ESLint with auto-fix enabled |
| `npm run format` | Formats the codebase with Prettier |
| `npm run preview` | Previews the production build locally |

## Project Structure

```txt
src/
├── api/           # API fetch and response mapping
├── components/    # Reusable UI components
├── composables/   # Reusable composition helpers
├── constants/     # App-wide, API, category, and timing constants
├── stores/        # Pinia state management
├── tests/         # Vitest unit tests
├── types/         # TypeScript domain and API types
├── utils/         # Business logic and formatting helpers
├── App.vue
├── env.d.ts
├── main.ts
└── style.css
```

## Implementation Notes

### Race Visibility Logic

Visible races are derived from fetched data by removing expired races, applying the active category filters, sorting by `advertised_start.seconds` in ascending order, and taking the first `5`. When fewer than `5` visible races remain for the current filter, the store refetches with larger counts up to `80`, so the app attempts to keep `5` visible races where valid data is available. If a race has already started but is still inside the 60-second live retention window, it is preserved locally during refill even if the next API response no longer includes it.

### Loading Behaviour

The UI uses two loading patterns:

- Initial and refill loading uses a blocking loading panel during the first load, and again when the current filtered result falls below `5` visible races while the app is refetching more data. This avoids briefly showing an incomplete race list during refill.
- Background refresh uses a small non-blocking loading state in the header. The updated timestamp is replaced with an icon-based `Loading` indicator while loading or refresh is in progress. The header loading state is kept visible for at least `1500ms` so the status change is noticeable rather than flashing briefly.

### Countdown Behaviour

Countdown values update every second. The countdown UI uses three label and styling states:

- `Starts In` - shown while a race has not started yet, using the default themed countdown surface
- `Closing Soon` - shown when a race is under one minute from the advertised start time, using an alert red treatment
- `Jump In` - shown once a race has started but is still inside the 60-second retention window, using a stronger live red treatment with an animated glow

### Category Filtering

The app supports the three task categories:

- Greyhound racing: `9daef0d7-bf3c-4f50-921d-8e818c60fe61`
- Harness racing: `161d9be2-e909-4326-8c2c-35ed71fb460b`
- Horse racing: `4a2788f8-e825-4d36-9894-efd4baf1cfae`

Filters can be combined. If the final specific category is deselected, the UI returns to the `All races` state instead of leaving the list with no active categories.

### State Management

`Pinia` manages the shared application state through `src/stores/racesStore.ts`. The store is responsible for:

- fetched races
- active filter state
- loading, initial loading, and refresh states
- error state
- last updated timestamp
- fetch-and-refill logic for keeping the visible list populated

### Stats Overview

The top summary area surfaces key live context for the race feed:

- `Starting Soon` shows how many visible races are currently inside the urgent countdown window
- `Active Filters` reflects the current category selection state
- `Next Race` shows the nearest upcoming countdown value
- `Live Status` displays a persistent live indicator in the current UI

### Desktop and Mobile Behaviour

- Desktop: selecting a race card opens the right-side detail panel, and switching cards updates the panel content in place.
- Mobile: race cards switch to an inline expansion pattern beneath the card, instead of using a fixed right-side detail panel.

### Styling Approach

The project uses custom styling rather than relying on a pre-styled component library. Styling is implemented with Tailwind CSS utility classes, custom `tailwind.config.ts` theme extensions, semantic color tokens, custom shadows, rounded surfaces, spacing, transitions, and custom card treatments.

The UI includes responsive layout, custom visual treatment, and theme-aware presentation.

### Light and Dark Themes

- Light theme: white base with violet and purple-pink accents.
- Dark theme: muted dark purple-grey base with soft lavender-warm accent treatment.

These theme tokens and shared surface styles are defined across `tailwind.config.ts` and `src/style.css`.

## Assumptions

- The API may return more than 5 races.
- The UI displays the first 5 visible races after filtering, expiry removal, and sorting.
- If fewer than 5 valid visible races remain even after refill attempts up to `count=80`, the UI shows fewer than 5 races.
- A race remains visible until it is more than 60 seconds past `advertised_start`.
- Category filters can be combined.
- If `meeting_name` is missing, the UI shows `Unknown meeting`.
- If `race_name` is missing, the UI shows `Race {race_number}`.
- If `venue_name` is missing in the detail panel, the UI shows `Venue unknown`.
- If both weather and track condition are missing, the `Conditions` block still renders and shows `Unknown`.
- If only `weather` is missing, the `Conditions` block shows `Weather unknown · {track_condition}`.
- If only `track_condition` is missing, the `Conditions` block shows `{weather} · Track condition unknown`.
- If the last updated timestamp is not available yet, the header shows `Waiting`.

## Accessibility and Responsiveness

- Responsive desktop and mobile layouts are implemented.
- Interactive cards and controls use semantic buttons.
- Race cards expose `aria-expanded` to reflect expanded or selected state.
- The loading state uses `aria-busy` and `aria-live`.
- Interactive controls include visible hover and focus styling.
