export interface UserMeta {
    first_name: string;
    last_name: string;
    nickname: string;
    stats_attendance_attended_cached: number;
    'skills-belaying': string;
    scores_attendance_reliability_score_cached: number;
    scores_volunteer_reliability_score_cached: number;
    scores_volunteer_value_cached: number;
    stats_attendance_indoor_wednesday_attended_cached: number;
    admin_can_you_help: string;
    climbing_indoors_leading_grades: string;
    climbing_indoors_toproping_grades: string;
    climbing_indoors_skills_passing_on: string;
    admin_first_timer_indoor: string;
    admin_wednesday_requests_notes: string;
    milestones_3_badge: string;
    milestones_5_band: string;
    stats_volunteer_for_numerator_cached: number;
    committee_current: string;
    cc_member: string;
    competency_indoor_trip_director: string;
    competency_indoor_checkin: string;
    competency_indoor_pairing: string;
    competency_indoor_floorwalker: string;
    competency_indoor_skillsharer: string;
    competency_indoor_announcements: string;
    cc_compliance_last_date_of_climbing: string;
    admin_code_of_conduct_accepted: string;
    admin_participation_statement_one: string;
    admin_participation_statement_two: string;

}

export interface OrderMeta {
    cc_attendance: string;
    cc_volunteer: string;
    cc_volunteer_attendance: string;
    order_status: string;

}

export interface RowData {
    user_id: string;
    order_id: string;
    user_meta: UserMeta;
    order_meta: OrderMeta;
    deleted?: boolean;
    order_status: string;

}
