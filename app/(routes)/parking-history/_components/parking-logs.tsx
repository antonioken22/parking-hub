import { useState } from "react";

import DataList from "./data-list-logs";
import VehicleConfiguration from "./configure";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type TabType = "logs" | "vehicles" | "configure";

const ParkingLogs: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>("logs");

  return (
    <div className="flex flex-col h-full p-2">
      <Tabs
        value={selectedTab}
        onValueChange={(tab) => setSelectedTab(tab as TabType)}
        className="flex flex-col w-full"
      >
        <TabsList className="justify-between md:justify-around">
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="configure">Configure</TabsTrigger>
        </TabsList>
        <TabsContent value="logs">
          <DataList tab="logs" />
        </TabsContent>
        <TabsContent value="vehicles">
          <DataList tab="vehicles" />
        </TabsContent>
        <TabsContent value="configure">
          <VehicleConfiguration />
        </TabsContent>
      </Tabs>
      {/*<Announcement />*/}
    </div>
  );
};

export default ParkingLogs;
