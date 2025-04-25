export interface Registration{
    id: string;
    members: string[];
    user_id: string;
    team_name : string;
    is_winner?: boolean;
    position?: number;
}