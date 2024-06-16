// hooks/useVillas.ts
import { useQuery } from '@tanstack/react-query';
import { fetchVillas } from '../services/apiService';
import { Villa } from '../types/api';

export const useVillas = () => {
    return useQuery<Villa[]>({
        queryKey: ['villas'],
        queryFn: fetchVillas
    });
};
