export interface AdminData {
    id:string;
    name: string;
    email: string;
    phone: string;
    department: string;
    role: "admin";
    college_id: string; // To link to the college document
}
