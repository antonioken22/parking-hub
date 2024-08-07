export interface ChatMessage {
  id?: string;
  message: string;
  dateCreated?: Date;
  isRead: boolean;
  isView: boolean;
  sender: {
    userId: string;
    userFirstName: string;
    userLastName: string;
  };
  recipient: {
    userId: string;
    userFirstName: string;
    userLastName: string;
  };
}
