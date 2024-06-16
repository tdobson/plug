import {useQuery, useMutation, useQueryClient} from 'react-query';
import { useEffect, useState } from 'react';
import { RowData } from '../types/api';

// Variable to toggle between Bearer authentication and WordPress Auth
const USE_BEARER_AUTH = true; // Set to false to use WordPress Auth

// Bearer token value (only needed if USE_BEARER_AUTH is true)
const BEARER_TOKEN = 'geeboh7Jeengie8uS1chaiqu';

interface QueryOptions {
    enabled: boolean;
}

// Custom hook for storing and retrieving the nonce
function useNonce() {
    const [nonce, setNonce] = useState<string | null>(null);

    useEffect(() => {
        const firstDivElement = document.querySelector('div');
        if (firstDivElement) {
            const nonceValue = firstDivElement.getAttribute('data-nonce');
            setNonce(nonceValue);
        }
    }, []);

    return nonce;
}

// Helper function to get headers
function getHeaders(nonce: string | null): { 'Content-Type': string; 'X-WP-Nonce'?: string; 'Authorization'?: string } {
    const headers: { 'Content-Type': string; 'X-WP-Nonce'?: string; 'Authorization'?: string } = {
        'Content-Type': 'application/json',
    };

    if (USE_BEARER_AUTH && BEARER_TOKEN) {
        headers['Authorization'] = `Bearer ${BEARER_TOKEN}`;

    } else if (nonce) {
        headers['X-WP-Nonce'] = nonce;
    }
    console.log('Headers:', headers); // Log headers to ensure nonce or token is included
    return headers;
}

// Custom hook for fetching user order IDs
export function useFetchUserOrderIDs(productId: string) {
    const nonce = useNonce();

    return useQuery(['userOrderIDs', productId], async () => {
        const headers = getHeaders(nonce);

        const response = await fetch(
            `https://www.climbingclan.com/wp-json/wc-api/v1/products/purchased/${productId}`,
            {
                headers: headers,
                credentials: 'same-origin', // Include cookies for WordPress auth
            }
        );

        if (response.status === 401) {
            window.location.href = `/wp-login.php?redirect_to=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        return await response.json();
    }, {
        staleTime: 60000, // Mark data as stale after 1 minute (60000 milliseconds)
        enabled: !!nonce || USE_BEARER_AUTH, // Only enable the query when nonce is available or using Bearer Auth
    });
}

export function useFetchDetailsForMissingUserOrderIDs(productId: string, userOrderIDs: string[], options: QueryOptions) {
    const nonce = useNonce();

    return useQuery(['userOrderDetails', productId, userOrderIDs], async () => {
        const userOrderMeta = {
            product_id: productId,
            user_order_ids: userOrderIDs,
            user_meta_keys: [
                'last_name',
                'stats_attendance_attended_cached',
                'skills-belaying',
                'first_name',
                'scores_attendance_reliability_score_cached',
                'scores_volunteer_reliability_score_cached',
                'scores_volunteer_score_cached',
                'stats_attendance_indoor_wednesday_attended_cached',
                'admin-can-you-help',
                'nickname',
                'climbing-indoors-leading-grades',
                'climbing-indoors-toproping-grades',
                'climbing-indoors-skills-passing-on',
                'admin-first-timer-indoor',
                'admin-wednesday-requests-notes',
                'milestones_3_badge',
                'milestones_5_band',
                'stats_volunteer_for_numerator_cached',
                'committee_current',
                'cc_member',
                'competency_indoor_trip_director',
                'competency_indoor_checkin',
                'competency_indoor_pairing',
                'competency_indoor_floorwalker',
                'competency_indoor_skillsharer',
                'competency_indoor_announcements',
                'cc_compliance_last_date_of_climbing',
                'admin-code-of-conduct-accepted',
                'admin-participation-statement-one',
                'admin-participation-statement-two'
            ],
            order_meta_keys: ['cc_attendance', 'cc_volunteer', 'cc_volunteer_attendance'],
        };

        const headers = getHeaders(nonce);

        const response = await fetch('https://www.climbingclan.com/wp-json/wp-api/v1/user-order-meta', {
            method: 'POST',
            headers: headers,
            credentials: 'same-origin', // Include cookies for WordPress auth
            body: JSON.stringify(userOrderMeta),
        });

        if (response.status === 401) {
            window.location.href = `/wp-login.php?redirect_to=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        return await response.json();
    }, {
        staleTime: 120000, // Mark data as stale after 2 minutes (120000 milliseconds)
        enabled: (!!nonce || USE_BEARER_AUTH) && options.enabled, // Only enable the query when nonce is available or using Bearer Auth and options.enabled is true
    });
}

export function useSendOrderMeta() {
    const nonce = useNonce();
    const queryClient = useQueryClient();

    return useMutation(
        async (rowData: RowData) => {
            const headers = getHeaders(nonce);

            const response = await fetch('https://www.climbingclan.com/wp-json/wp-api/v1/update-order-meta', {
                method: 'POST',
                headers: headers,
                credentials: 'same-origin', // Include cookies for WordPress auth
                body: JSON.stringify(rowData),
            });

            if (response.status === 401) {
                window.location.href = `/wp-login.php?redirect_to=${encodeURIComponent(window.location.pathname)}`;
                throw new Error('Unauthorized'); // Throw an error to be caught by the mutation
            }

            if (!response.ok) {
                throw new Error('Failed to update order meta'); // Throw an error for other non-successful responses
            }

            return await response.json();
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('userOrderDetails');
            },
        }
    );
}

// Custom hook for fetching live events
export function useFetchLiveEvents() {
    const nonce = useNonce();

    return useQuery('liveEvents', async () => {
        const headers = getHeaders(nonce);

        const response = await fetch('https://www.climbingclan.com/wp-json/wc-api/v1/products/live-events', {
            method: 'GET',
            headers: headers,
            credentials: 'same-origin', // Include cookies for WordPress auth
        });

        if (response.status === 401) {
            window.location.href = `/wp-login.php?redirect_to=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        return await response.json();
    }, {
        staleTime: 60000, // Mark data as stale after 1 minute (60000 milliseconds)
        enabled: !!nonce || USE_BEARER_AUTH, // Only enable the query when nonce is available or using Bearer Auth
    });
}

// Custom hook for fetching product customers
export function useFetchProductCustomers(productId: string) {
    const nonce = useNonce();

    return useQuery(['productCustomers', productId], async () => {
        const headers = getHeaders(nonce);

        const response = await fetch(`https://www.climbingclan.com/wp-json/wc-api/v1/products/purchased/${productId}`, {
            method: 'GET',
            headers: headers,
            credentials: 'same-origin', // Include cookies for WordPress auth
        });

        if (response.status === 401) {
            window.location.href = `/wp-login.php?redirect_to=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        return await response.json();
    }, {
        staleTime: 60000, // Mark data as stale after 1 minute (60000 milliseconds)
        enabled: !!nonce || USE_BEARER_AUTH, // Only enable the query when nonce is available or using Bearer Auth
    });
}
