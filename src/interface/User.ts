import { Participation } from "./Participation";

export interface UserData {
    user_name: string;
    user_last_name: string;
    user_id: string;
    user_department: string;
    user_college_id: string;
    user_blood_group: string;
    user_age: number;
    profile_completed: boolean;
    user_preferences: string[];
    user_role: string;
    participations: Participation[];
  }