export interface UserData {
  id: string;
  email: string;
  photoUrl: string | null;
  firstName: string;
  lastName: string;
  role: string;
  pushNotificationStatus: boolean;
  fcmSwToken: string | null;
  isBooked: boolean;
  parkingSlotAssignment: string | null;
}
