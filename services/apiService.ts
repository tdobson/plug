// services/apiService.ts
import { Booking, Villa } from '../types/api';

const API_BASE_URL = 'http://localhost:3000';

export async function fetchVillas(): Promise<Villa[]> {
    const response = await fetch(`${API_BASE_URL}/villas`);
    if (!response.ok) {
        throw new Error('Failed to fetch villas');
    }
    return await response.json();
}

export async function fetchBookings(): Promise<Booking[]> {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    if (!response.ok) {
        throw new Error('Failed to fetch bookings');
    }
    return await response.json();
}

export async function createBooking(bookingData: Booking): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
        throw new Error('Failed to create booking');
    }
    return response.json();
}

export async function updateBooking({ id, data }: { id: number; data: Partial<Booking> }): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to update booking');
    }
    return response.json();
}

export async function deleteBooking(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete booking');
    }
}
