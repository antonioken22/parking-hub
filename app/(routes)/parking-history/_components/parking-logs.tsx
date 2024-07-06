import { useState } from "react";

import DataList from "./data-list-logs";
import Announcement from "./announcement";

type Tab = "logs" | "vehicles" | "delete" | "configure";

const ParkingLogs: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>("logs");

  const renderContent = () => {
    return <DataList tab={selectedTab} />;
  };

  return (
    <div className="flex flex-col justify-center items-stretch h-full p-2">
      <div className="flex flex-col bg-primary-foreground text-white rounded-lg mb-4 p-4">
        <div className="flex justify-between mb-5 space-x-1">
          <button
            className={`flex-1 p-2 rounded text-xs md:text-base ${
              selectedTab === "logs"
                ? "bg-black text-white"
                : "bg-primary text-black"
            }`}
            onClick={() => setSelectedTab("logs")}
          >
            Logs
          </button>
          <button
            className={`flex-1 p-2 rounded text-xs md:text-base ${
              selectedTab === "vehicles"
                ? "bg-black text-white"
                : "bg-primary text-black"
            }`}
            onClick={() => setSelectedTab("vehicles")}
          >
            Vehicles
          </button>
          {/* <button
            className={`flex-1 p-2 rounded text-xs md:text-base ${
              selectedTab === "delete"
                ? "bg-black text-white"
                : "bg-primary text-black"
            }`}
            onClick={() => setSelectedTab("delete")}
          >
            Delete
          </button> */}
          <button
            className={`flex-1 p-2 rounded text-xs md:text-base ${
              selectedTab === "configure"
                ? "bg-black text-white"
                : "bg-primary text-black"
            }`}
            onClick={() => setSelectedTab("configure")}
          >
            Configure
          </button>
        </div>
        <div className="flex flex-col space-y-4 bg-main  rounded">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ParkingLogs;
