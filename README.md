# Venue Booking Backend

A Node.js/Express REST API for booking venues (bowling alleys, darts lounges, and similar entertainment venues). Written in TypeScript with ESM modules.

> **Note:** This project is currently a prototype. Venues, time slots, and bookings are all stored in in-memory mock data — nothing is persisted to a database, and data resets on every server restart.

## Requirements

- Node.js
- npm

## Setup

```bash
npm install
```

Create a `.env` file in the project root to configure the port (optional, defaults to `5000`):

```
PORT=5000
```

## Usage

Run the server in development mode with hot reload:

```bash
npm run dev
```

Build and run for production:

```bash
npm run build
npm start
```

Once running, the API is available at `http://localhost:5000` (or your configured `PORT`).

## API Reference

All endpoints return JSON. Routes are prefixed with `/api`, except for the health check.

| Method | Endpoint                     | Description                          |
| ------ | ---------------------------- | ------------------------------------ |
| GET    | `/health`                    | Liveness check                       |
| GET    | `/api/venues`                | List all venues                      |
| GET    | `/api/venues/:venueId`       | Get a single venue by ID             |
| GET    | `/api/availability/:venueId` | Get available time slots for a venue |
| POST   | `/api/bookings`              | Create a booking                     |
| PUT    | `/api/bookings/:bookingId`   | Update a booking's status            |

### `GET /api/availability/:venueId`

Returns time slots for the venue with computed availability:

```json
[
  {
    "id": "slot-1",
    "time": "2024-01-15T10:00:00Z",
    "price": 30,
    "available": true,
    "spotsRemaining": 4
  }
]
```

### `POST /api/bookings`

Request body:

```json
{
  "venueId": "1",
  "slotId": "slot-1",
  "customerName": "Jane Doe",
  "customerEmail": "jane@example.com"
}
```

Validates that the venue and slot exist and that the slot has remaining capacity. Returns `201` with the created booking (status `pending`) on success.

### `PUT /api/bookings/:bookingId`

Request body:

```json
{
  "status": "confirmed"
}
```

`status` must be one of `pending`, `confirmed`, or `cancelled`.

## Project Structure

The entire application lives in `src/index.ts`, including mock data, route handlers, and server startup. See `CLAUDE.md` for a more detailed architecture overview.

## Scripts

| Script          | Description                                  |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Run the server with hot reload via `tsx`     |
| `npm run build` | Type-check and compile TypeScript to `dist/` |
| `npm start`     | Run the compiled server from `dist/index.js` |
| `npm test`      | Not yet implemented                          |
