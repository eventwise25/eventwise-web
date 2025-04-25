export interface Resource {
    id: string;
    name: string;
    adminId: string;
    type: string;
    department: string;
    booked_slots: TimeSlot[];
    alternative_resources: string[];
  }
  
export interface TimeSlot {
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
  }
  