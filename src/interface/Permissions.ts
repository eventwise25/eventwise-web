import { EventFormData } from "./Events";
import { Resource } from "./Resources";

export interface Permission {
    id: string;
    event_id: string;
    organizer_id: string;
    resource_id: string;
    admin_id : string;
    requested_slot: {
      start_date: string;
      end_date: string;
      start_time: string;
      end_time: string;
    };
    status: "pending_admin_approval" | "approved" | "rejected";
    resource : Resource | undefined;
    event : EventFormData | undefined;
  }