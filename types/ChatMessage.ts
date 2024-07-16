export interface ChatMessage {
  id?: string;
  message: string;
  dateCreated?: Date;
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
