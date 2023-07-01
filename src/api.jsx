const authToken = "geeboh7Jeengie8uS1chaiqu";

export async function fetchUserOrderIDs(product_id) {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + authToken,
    };

    const response = await fetch(
        `https://www.climbingclan.com/wp-json/wc-api/v1/products/purchased/${product_id}`,
        {
            headers: headers,
        }
    );

    return await response.json();
}

export async function fetchDetailsForMissingUserOrderIDs(product_id, userOrderIDs) { // Add product_id as an argument
    const userOrderMeta = {
        product_id,
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
        ],
        order_meta_keys: ['cc_attendance', 'cc_volunteer', 'cc_volunteer_attendance'],
    };

    const postResponse = await fetch(`https://www.climbingclan.com/wp-json/wp-api/v1/user-order-meta`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + authToken,
        },
        body: JSON.stringify(userOrderMeta),
    });

    return await postResponse.json();
}
