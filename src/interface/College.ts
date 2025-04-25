export interface CollegeData {
    id:string;
    name: string; // "Pimpri Chinchwad College of Engineering"
    email : string;
    website: string; // "https://www.pccoepune.com/"
    location: {
        address: string;
        city: string;
        country: string;
        pincode: string;
    };
    departments : string[],
    role: "college";
}
