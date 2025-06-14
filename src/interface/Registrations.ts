export interface Registration {
    id: string;
    user_id: string;
    team_name: string;
    members: {
      id: string;
      accepted: boolean;
    }[];
    is_winner?: boolean;
    position?: number;
  }
  