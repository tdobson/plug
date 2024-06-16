// hooks/useBookings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBookings, createBooking, updateBooking, deleteBooking } from '../services/apiService';
import { Booking } from '../types/api';

export const useBookings = () => {
    return useQuery<Booking[]>({
        queryKey: ['bookings'],
        queryFn: fetchBookings
    });
};

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation<Booking, Error, Booking>({
        mutationFn: createBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation<Booking, Error, { id: number; data: Partial<Booking> }>({
        mutationFn: updateBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

export const useDeleteBooking = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, number>({
        mutationFn: deleteBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};
