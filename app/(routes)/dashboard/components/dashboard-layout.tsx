import { useState } from 'react';
import DataList from './dashboard-data-list-logs';


type Tab = 'logs' | 'vehicles' | 'delete' | 'configure';

const DashboardLayout: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>('logs');

  const renderContent = () => {
    return <DataList tab={selectedTab} />;
  };

  return (
    <div className="flex flex-center">
      <div className="flex flex-col w-2/3 p-8 ">
        <div className="flex space-x-4 mb-8">
          <button
            className={`p-4 rounded ${selectedTab === 'logs' ? 'bg-primary-foreground text-white' : "bg-primary text-black"}`}
            onClick={() => setSelectedTab('logs')}
          >
            Logs
          </button>
          <button
            className={`p-4 rounded ${selectedTab === 'vehicles' ? 'bg-primary-foreground text-white' : "bg-primary text-gray-700"}`}
            onClick={() => setSelectedTab('vehicles')}
          >
            Vehicles
          </button>
          <button
            className={`p-4 rounded ${selectedTab === 'delete' ? 'bg-primary-foreground text-white' : "bg-primary text-gray-700"}`}
            onClick={() => setSelectedTab('delete')}
          >
            Delete
          </button>
          <button
            className={`p-4 rounded ${selectedTab === 'configure' ? 'bg-primary-foreground text-white' : "bg-primary text-gray-700"}`}
            onClick={() => setSelectedTab('configure')}
          >
            Configure
          </button>
        </div>
        <div className="flex flex-col space-y-4 bg-main p-6 rounded">
          {renderContent()}
        </div>
      </div>
      <div className="flex flex-col w-1/3 p-8 rounded bg-primary text-black ">     
        <div className="mb-8 p-6 bg-primary-foreground text-center rounded">ANNOUNCEMENT!</div>
        <div className="p-6 bg-primary-foreground text-center rounded">
          STATUS
          <div className="mt-4">
            <div className="relative w-24 h-24 mx-auto">
              <svg className="absolute inset-0 w-full h-full">
                <circle cx="50%" cy="50%" r="45%" stroke="black" strokeWidth="10" fill="none" />
                <circle cx="50%" cy="50%" r="45%" stroke="orange" strokeWidth="10" strokeDasharray="calc(282.6 * 0.25) 282.6" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
