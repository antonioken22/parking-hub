import DataList from "./data-list-logs";
type TabType = "logs";

const ParkingLogs: React.FC = () => {
  return (
    <div className="flex flex-col h-full p-2">
          <DataList tab="logs" />
    </div>
  );
};

export default ParkingLogs;
