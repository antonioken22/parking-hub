import { useState } from "react";

import DataList from "./data-list-logs";
import Announcement from "./announcement";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type TabType = "logs" | "vehicles" | "configure";

const ParkingLogs: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>("logs");

  return (
    <div className="flex flex-col justify-center items-stretch h-full p-2">
      <Tabs value={selectedTab} onValueChange={(tab) => setSelectedTab(tab as TabType)}>
        <TabsList>
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
          {/* Add configure content here */}
        </TabsContent>
      </Tabs>
      {/*<Announcement />*/}
    </div>
  );
};

export default ParkingLogs;
