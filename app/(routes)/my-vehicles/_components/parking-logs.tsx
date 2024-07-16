import { useState } from "react";
import DataList from "./data-list-logs";
import VehicleConfiguration from "./configure";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type TabType = "vehicles" | "configure";

const ParkingLogs: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>("vehicles");

  return (
    <div className="flex flex-col h-full p-2">
      <Tabs
        value={selectedTab}
        onValueChange={(tab) => setSelectedTab(tab as TabType)}
        className="flex flex-col w-full"
      >
        <TabsList className="center space-x-6 md:justify-around">
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="configure">Configure</TabsTrigger>
        </TabsList>
        <TabsContent value="vehicles">
          <DataList tab="vehicles" />
        </TabsContent>
        <TabsContent value="configure">
          <VehicleConfiguration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParkingLogs;
