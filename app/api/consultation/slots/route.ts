import { NextRequest, NextResponse } from 'next/server';
import { consultationService } from '@/lib/services/consultationService';

// Helper function to handle service errors
const handleServiceError = (error: unknown, defaultMessage: string) => {
  console.error(defaultMessage, error);
  const errorMessage = error instanceof Error ? error.message : String(error);
  return NextResponse.json({
    error: defaultMessage,
    details: errorMessage
  }, { status: 500 });
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    const filters = {
      date: date || undefined,
      status: status || undefined,
    };

    const slots = await consultationService.getTimeSlots(filters);

    return NextResponse.json(slots);
  } catch (error) {
    return handleServiceError(error, 'Error fetching time slots');
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.date || !data.start_time || !data.end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create new time slot
    const newSlot = await consultationService.createTimeSlot({
      date: new Date(data.date),
      start_time: data.start_time,
      end_time: data.end_time,
      status: data.status || 'available',
      max_bookings: data.max_bookings || 1,
      current_bookings: data.current_bookings || 0,
    });

    return NextResponse.json(newSlot, { status: 201 });
  } catch (error) {
    return handleServiceError(error, 'Error creating time slot');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 });
    }

    const data = await request.json();

    // Update the time slot
    const updatedSlot = await consultationService.updateTimeSlot(id, data);

    return NextResponse.json(updatedSlot);
  } catch (error) {
    return handleServiceError(error, 'Error updating time slot');
  }
}