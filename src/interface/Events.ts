export interface EventFormData {
  id: string;
  name: string;
  description: string;
  type: "Hackathon" | "Technical" | "Cultural" | "Sports";
  mode: "Online" | "Offline";
  department: string;
  venue: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  registration_deadline: string;
  max_participants: number;
  is_team_event: boolean;
  min_team_size?: number;
  max_team_size?: number;
  event_categories : string[],
  images?: string[];
  videos?: string[];
  status: "draft"| "upcoming" | "live" | "completed";
  prizes?: Record<string, number>;  // Key-value pair { "1": 10000, "2": 5000 }
  goodies?: string[];  // ["T-shirt", "Bag"]
  results?: {
    registration_id: string;
    win_position: number;
  }[];
  created_at : string;
}