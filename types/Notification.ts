export interface Notification {
  id?: string;
  title: string;
  body: string;
  link?: string | null;
  timeStart: Date;
  timeEnd: Date;
  isRead: boolean;
  isView: boolean;
  dateCreated?: { seconds: number }; // For sorting notifications only
  recipient: Array<{
    userId: string;
    userEmail: string;
    userFirstName: string;
    userLastName: string;
    userFcmSwToken: string;
  }>;
}
