export interface UserData {
  id: string;
  email: string | null;
  photoUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
  fcmSwToken: string | null;
  isBooked: boolean | null;
}
