export interface UserData {
  id: string;
  email: string;
  photoUrl: string | null;
  firstName: string;
  lastName: string;
  role: string;
  fcmSwToken: string | null;
  isBooked: boolean;
}
