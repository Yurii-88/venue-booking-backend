# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — run the server with hot reload via `tsx` (reads `src/index.ts` directly, no build step)
- `npm run build` — type-check and compile to `dist/` via `tsc`
- `npm start` — run the compiled server from `dist/index.js` (requires `npm run build` first)
- There is no test suite yet (`npm test` is a placeholder that exits with an error)
- Server port is read from `PORT` env var (`.env`), defaulting to 5000

## Architecture

This is a Node.js/Express REST API for booking venues (bowling alleys, darts lounges, etc.), written in TypeScript with ESM modules (`"type": "module"` in package.json, `module`/`moduleResolution` set for bundler-style ESM in tsconfig).

The entire application currently lives in a single file: `src/index.ts`. There is no database — venues, time slots, and bookings are all in-memory mock arrays/objects defined at the top of that file, so any created bookings are not persisted and reset on restart.

Domain model:

- **Venue**: `id`, `name`, `location`, `timezone`
- **TimeSlot**: `id`, `venueId`, `startTime`/`endTime` (ISO 8601), `price`, `capacity`, `booked` (count)
- **Booking**: created on demand from a venue + slot + customer info, with a `status` of `pending` | `confirmed` | `cancelled`

Routes (all under `/api` except `/health`):

- `GET /health` — liveness check
- `GET /api/venues` — list venues
- `GET /api/venues/:venueId` — single venue
- `GET /api/availability/:venueId` — time slots for a venue, derived from `timeSlots` filtered by `venueId`, with `available`/`spotsRemaining` computed from `capacity - booked`
- `POST /api/bookings` — create a booking; validates required fields and slot capacity, but does not mutate `slot.booked` (mock only)
- `PUT /api/bookings/:bookingId` — update a booking's status; validates against the `pending`/`confirmed`/`cancelled` enum but does not look up or persist an actual booking (mock only)
- Unmatched routes fall through to a catch-all 404 JSON handler

When extending this codebase (e.g. adding real persistence, splitting into routers/controllers, or adding auth), follow the existing single-purpose route-handler style already in `src/index.ts` until a real module structure is introduced.
