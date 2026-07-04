export type Guest = {
    id: string;
  
    hotel_id: string;
  
    first_name: string;
    last_name: string;
  
    email: string | null;
    phone: string | null;
  
    country: string | null;
    city: string | null;
  
    notes: string | null;
  
    total_bookings: number;
    total_spent: number;
  
    created_at: string;
    updated_at: string;
  };