import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock data
const venues = [
  {
    id: '1',
    name: 'Downtown Bowling',
    location: 'New York',
    timezone: 'America/New_York',
  },
  {
    id: '2',
    name: 'Darts Lounge',
    location: 'Brooklyn',
    timezone: 'America/New_York',
  },
];

const timeSlots = [
  {
    id: 'slot-1',
    venueId: '1',
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T11:00:00Z',
    price: 30,
    capacity: 4,
    booked: 0,
  },
  {
    id: 'slot-2',
    venueId: '1',
    startTime: '2024-01-15T11:00:00Z',
    endTime: '2024-01-15T12:00:00Z',
    price: 30,
    capacity: 4,
    booked: 1,
  },
  {
    id: 'slot-3',
    venueId: '1',
    startTime: '2024-01-15T19:00:00Z',
    endTime: '2024-01-15T20:00:00Z',
    price: 50,
    capacity: 4,
    booked: 2,
  },
  {
    id: 'slot-4',
    venueId: '2',
    startTime: '2024-01-15T14:00:00Z',
    endTime: '2024-01-15T15:00:00Z',
    price: 25,
    capacity: 6,
    booked: 0,
  },
];

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'Server running ✅' });
});

app.get('/api/venues', (req, res) => {
  res.json(venues);
});

app.get('/api/venues/:venueId', (req, res) => {
  const { venueId } = req.params;
  const venue = venues.find((v) => v.id === venueId);
  if (!venue) {
    return res.status(404).json({ error: 'Venue not found' });
  }
  res.json(venue);
});

app.get('/api/availability/:venueId', (req, res) => {
  const { venueId } = req.params;
  const venue = venues.find((v) => v.id === venueId);
  if (!venue) {
    return res.status(404).json({ error: 'Venue not found' });
  }

  const slots = timeSlots.filter((slot) => slot.venueId === venueId);
  const availability = slots.map((slot) => ({
    id: slot.id,
    time: slot.startTime,
    price: slot.price,
    available: slot.booked < slot.capacity,
    spotsRemaining: slot.capacity - slot.booked,
  }));

  res.json(availability);
});

app.post('/api/bookings', (req, res) => {
  const { venueId, slotId, customerName, customerEmail } = req.body;

  if (!venueId || !slotId || !customerName || !customerEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const venue = venues.find((v) => v.id === venueId);
  if (!venue) {
    return res.status(404).json({ error: 'Venue not found' });
  }

  const slot = timeSlots.find((s) => s.id === slotId);
  if (!slot) {
    return res.status(404).json({ error: 'Slot not found' });
  }

  if (slot.booked >= slot.capacity) {
    return res.status(400).json({ error: 'Slot is fully booked' });
  }

  const booking = {
    id: `booking-${Date.now()}`,
    venueId,
    slotId,
    customerName,
    customerEmail,
    status: 'pending',
    price: slot.price,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json(booking);
});

app.put('/api/bookings/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  const updatedBooking = {
    id: bookingId,
    status,
    updatedAt: new Date().toISOString(),
  };

  res.json(updatedBooking);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api/venues`);
});
