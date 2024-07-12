export interface ParkingSlotData {
  id: string;
  parkingArea: string;
  parkingSlotNumber: number;
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  status: string;
  occupantEmail: string | null;
  occupantFirstName: string | null;
  occupantLastName: string | null;
  startTime: Date | null;
  endTime: Date | null;
  description: string | null;
}
