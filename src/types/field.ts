

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; 
  comment: string;
  date: string; 
  userAvatar?: string;
}

export interface Owner {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  businessLicense?: string;
  establishedYear?: number;
  description?: string;
  socialMedia?: {
    facebook?: string;
    zalo?: string;
    website?: string;
  };
}

export interface Field {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: number; 
  reviewsList: Review[]; 
  price: string;
  openingHours: string;
  startHour: number;
  endHour: number;
  image: string;
  description: string;
  sport: 'football' | 'badminton' | 'pickle';
  isPopular: boolean;
  subCourts: SubCourt[];
  owner: Owner; 
}

export interface SubCourt {
  id: string;
  name: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  price: number;
}

export interface MainSport {
  name: string;
  icon: string;
  description: string;
  courts: number;
  color: string;
}