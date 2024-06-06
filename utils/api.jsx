    // Define the data for the request. The data includes the product ID, the list of user order IDs, and the user and order meta keys to be fetched
    import { useQuery, useMutation } from 'react-query';

    const authToken = 'geeboh7Jeengie8uS1chaiqu';

    // Custom hook for fetching user order IDs
    export function useFetchUserOrderIDs(productId) {
        return useQuery(['userOrderIDs', productId], async () => {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authToken,
            };

            const response = await fetch(
                `https://www.climbingclan.com/wp-json/wc-api/v1/products/purchased/${productId}`,
                {
                    headers: headers,
                }
            );

            return await response.json();
        }, {
            staleTime: 60000, // Mark data as stale after 1 minute (60000 milliseconds)
        });
    }

    // Custom hook for fetching details for missing user order IDs
    export function useFetchDetailsForMissingUserOrderIDs(productId, userOrderIDs) {
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

            const response = await fetch('https://www.climbingclan.com/wp-json/wp-api/v1/user-order-meta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authToken,
                },
                body: JSON.stringify(userOrderMeta),
            });

            return await response.json();
        }, {
            staleTime: 120000, // Mark data as stale after 1 minute (60000 milliseconds)
        });
    }

    // Custom hook for sending order meta data
    export function useSendOrderMeta() {
        return useMutation(async (userOrderMeta) => {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + authToken,
            };

            const response = await fetch('https://www.climbingclan.com/wp-json/wp-api/v1/update-order-meta', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(userOrderMeta),
            });

            return await response.json();
        });
    }


