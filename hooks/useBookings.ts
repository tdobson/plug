// hooks/useBookings.ts

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchBookings, createBooking, updateBooking, deleteBooking } from '../services/apiService';
import { Booking } from '../types/api';

export const useBookings = () => {
    return useQuery<Booking[]>('bookings', fetchBookings);
};

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation(createBooking, {
        onSuccess: () => {
            queryClient.invalidateQueries('bookings');
        },
    });
};

export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation(updateBooking, {
        onSuccess: () => {
            queryClient.invalidateQueries('bookings');
        },
    });
};

export const useDeleteBooking = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteBooking, {
        onSuccess: () => {
            queryClient.invalidateQueries('bookings');
        },
    });
};
