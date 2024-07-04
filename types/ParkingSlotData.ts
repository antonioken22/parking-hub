export interface ParkingSlotData {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  status: string;
  name: string | null;
  startTime: Date | null;
  endTime: Date | null;
  description: string | null;
  pushNotification: boolean;
}
