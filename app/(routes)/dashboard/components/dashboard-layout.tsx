import { useState, useRef, useEffect } from 'react';
import DataList from './dashboard-data-list-logs';
import MobileFriendlyComponent from './dashboard-announcement';

type Tab = 'logs' | 'vehicles' | 'delete' | 'configure';

const DashboardLayout: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>('logs');
  const tabRefs = useRef<{ [key in Tab]: HTMLButtonElement | null }>({
    logs: null,
    vehicles: null,
    delete: null,
    configure: null,
  });

  const renderContent = () => {
    return <DataList tab={selectedTab} />;
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center before:items-stretch lg:items-center h-full lg:h-screen p-4 lg:p-8">
      <div className="flex flex-col w-full lg:w-2/3 bg-primary-foreground text-white rounded-lg mb-4 lg:mb-0 p-4 lg:p-8 mr-6 ml">
        <div className="relative mb-5">
          <div className="flex justify-between space-x-1 border-b-2 border-gray-200">
            {(['logs', 'vehicles', 'delete', 'configure'] as Tab[]).map((tab) => (
              <button
                key={tab}
                ref={(el) => (tabRefs.current[tab] = el)}
                className={`flex-1 py-2 text-sm md:text-base lg:text-lg rounded transition-colors duration-300 ${
                  selectedTab === tab ? 'bg-black text-white' : 'bg-primary text-black'
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div
            className="absolute bottom-0 h-1 bg-orange-500 transition-all duration-300"
            style={{
              width: `${tabRefs.current[selectedTab]?.offsetWidth}px`,
              transform: `translateX(${tabRefs.current[selectedTab]?.offsetLeft}px)`,
            }}
          />
        </div>
        <div className="flex flex-col space-y-4 bg-main p-6 rounded">
          {renderContent()}
        </div>
      </div>
      
    </div>
  );
};

export default DashboardLayout;
