import { useState } from 'react';
import DataList from './dashboard-data-list-logs';
import Link from 'next/link';
import MobileFriendlyComponent from './dashboard-announcement';
type Tab = 'logs' | 'vehicles' | 'delete' | 'configure';

const DashboardLayout: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>('logs');

  const renderContent = () => {
    return <DataList tab={selectedTab} />;
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-stretch lg:items-center h-full lg:h-screen p-4 lg:p-8">
    <div className="flex flex-col w-full lg:w-2/3 bg-primary-foreground text-white rounded-lg mb-4 lg:mb-0 p-4 lg:p-8 mr-6 ml">
      <div className="flex justify-between mb-8 space-x-1">
        <button
          className={`flex-1 p-4 rounded ${selectedTab === 'logs' ? 'bg-black text-white' : 'bg-primary text-black'}`}
          onClick={() => setSelectedTab('logs')}
        >
          Logs
        </button>
        <button
          className={`flex-1 p-4 rounded ${selectedTab === 'vehicles' ? 'bg-black text-white' : 'bg-primary text-black'}`}
          onClick={() => setSelectedTab('vehicles')}
        >
          Vehicles
        </button>
        <button
          className={`flex-1 p-4 rounded ${selectedTab === 'delete' ? 'bg-black text-white' : 'bg-primary text-black'}`}
          onClick={() => setSelectedTab('delete')}
        >
          Delete
        </button>
        <button
          className={`flex-1 p-4 rounded ${selectedTab === 'configure' ? 'bg-black text-white' : 'bg-primary text-black'}`}
          onClick={() => setSelectedTab('configure')}
        >
          Configure
        </button>
      </div>
      <div className="flex flex-col space-y-4 bg-main p-6 rounded">
        {renderContent()}
      </div>
    </div>
    <MobileFriendlyComponent/>
  </div>
  
  );
};

export default DashboardLayout;
