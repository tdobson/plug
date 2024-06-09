import { useQuery, useMutation } from 'react-query';
import { useEffect, useState } from 'react';
import { RowData } from '../types/checkin';

// Load environment variables in development
if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

interface WpApiSettings {
    nonce: string;
    [key: string]: any;
}

interface QueryOptions {
    enabled: boolean;
}

// Helper function to get wpApiSettings from window object
function getWpApiSettings(): WpApiSettings | null {
    return (typeof window !== 'undefined' && (window as any).wpApiSettings) ? (window as any).wpApiSettings : null;
}

// Helper function to get headers based on environment
function getHeaders(): { 'Content-Type': string; 'Authorization'?: string; 'X-WP-Nonce'?: string } {
    const headers: { 'Content-Type': string; 'Authorization'?: string; 'X-WP-Nonce'?: string } = {
        'Content-Type': 'application/json',
    };

    if (process.env.NODE_ENV === 'development') {
        const apiKey = process.env.REACT_APP_API_KEY;
        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }
    } else {
        const wpApiSettings = getWpApiSettings();
        if (wpApiSettings) {
            headers['X-WP-Nonce'] = wpApiSettings.nonce;
        }
    }

    return headers;
}

// Custom hook for fetching user order IDs
export function useFetchUserOrderIDs(productId: string) {
    const [wpSettings, setWpSettings] = useState<WpApiSettings | null>(null);

    useEffect(() => {
        setWpSettings(getWpApiSettings());
    }, []);

    return useQuery(['userOrderIDs', productId], async () => {
        const headers = getHeaders();

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
        enabled: !!wpSettings, // Only enable the query when wpSettings is available
    });
}

export function useFetchDetailsForMissingUserOrderIDs(productId: string, userOrderIDs: string[], options: QueryOptions) {
    const [wpSettings, setWpSettings] = useState<WpApiSettings | null>(null);

    useEffect(() => {
        setWpSettings(getWpApiSettings());
    }, []);

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
                'scores_volunteer_value_cached',
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

        const headers = getHeaders();

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
        enabled: !!wpSettings && options.enabled, // Only enable the query when wpSettings is available and options.enabled is true
    });
}

export function useSendOrderMeta() {
    return useMutation(async (rowData: RowData) => {
        const headers = getHeaders();

        const response = await fetch('https://www.climbingclan.com/wp-json/wp-api/v1/update-order-meta', {
            method: 'POST',
            headers: headers,
            credentials: 'same-origin', // Include cookies for WordPress auth
            body: JSON.stringify(rowData),
        });

        if (response.status === 401) {
            window.location.href = `/wp-login.php?redirect_to=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        return await response.json();
    });
}

// Custom hook for fetching live events
export function useFetchLiveEvents() {
    return useQuery('liveEvents', async () => {
        const headers = getHeaders();

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
    });
}

// Custom hook for fetching product customers
export function useFetchProductCustomers(productId: string) {
    return useQuery(['productCustomers', productId], async () => {
        const headers = getHeaders();

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
    });
}
