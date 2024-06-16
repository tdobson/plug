// types/api.ts
export interface Villa {
    uuid: string;
    website_id: number;
    legacy_id: number;
    name: string;
    description: string;
    resort: string;
    capacity_adults: number;
    capacity_children: number;
    price: number;
    owner: string;
    created_by: string;
    amended_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface Booking {
    id: number;
    uuid: string;
    customer_uuid: string;
    villa_uuid: string;
    start_date: string;
    end_date: string;
    adults: number;
    children: number;
    recorded_cost: number;
    booked_by: string;
    amended_by: string | null;
    status: string;
    booking_type: string;
    created_at: string;
    updated_at: string;
}

export interface Customer {
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}
