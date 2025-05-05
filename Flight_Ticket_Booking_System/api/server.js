// api/server.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default async (req, res) => {
  try {
    // Dynamically import the ESM module
    const { reqHandler } = await import('../dist/flight_ticket_booking_system/server/server.mjs');
    await reqHandler(req, res);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send('Server error');
  }
};