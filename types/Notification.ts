export interface Notification {
  id?: string;
  title: string;
  body: string;
  link?: string | null;
  timeStart: Date;
  timeEnd: Date;
  isRead: boolean;
  isView: boolean;
  dateCreated?: Date;
  recipient: Array<{
    userId: string;
    userEmail: string;
    userFirstName: string;
    userLastName: string;
    userFcmSwToken: string;
  }>;
}
