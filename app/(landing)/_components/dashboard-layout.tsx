import { useState } from 'react';
import DataList from "@/app/(landing)/_components/dashboard-data-list-logs";
<<<<<<< HEAD
import Link from "next/link";
=======
>>>>>>> 40747e5c2cadceabc7427188d1b760da293799bb

type Tab = 'logs' | 'vehicles' | 'delete' | 'configure';

const DashboardLayout: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>('logs');

  const renderContent = () => {
    return <DataList tab={selectedTab} />;
  };

  return (
<<<<<<< HEAD
    <div className="flex justify-center items-center  p-4">
  <div className="flex flex-col lg:flex-row w-full lg:w-4/5 p-4 lg:p-8 bg-background text-foreground rounded-lg">
    <div className="flex flex-col w-full lg:w-2/3 p-4 lg:p-8 bg-background text-foreground">
      <div className="flex flex-wrap justify-between mb-8">
        <button
          className={`w-full sm:w-auto p-4 mb-4 sm:mb-0 rounded ${selectedTab === 'logs' ? 'bg-primary text-black' : 'bg-primary'}`}
          onClick={() => setSelectedTab('logs')}
        >
          Logs
        </button>
        <button
          className={`w-full sm:w-auto p-4 mb-4 sm:mb-0 rounded ${selectedTab === 'vehicles' ? 'bg-primary text-black' : 'bg-primary'}`}
          onClick={() => setSelectedTab('vehicles')}
        >
          Vehicles
        </button>
        <button
          className={`w-full sm:w-auto p-4 mb-4 sm:mb-0 rounded ${selectedTab === 'delete' ? 'bg-primary text-black' : 'bg-primary'}`}
          onClick={() => setSelectedTab('delete')}
        >
          Delete
        </button>
        <button
          className={`w-full sm:w-auto p-4 mb-4 sm:mb-0 rounded ${selectedTab === 'configure' ? 'bg-primary text-black' : 'bg-primary'}`}
          onClick={() => setSelectedTab('configure')}
        >
          Configure
        </button>
      </div>
      <div className="flex flex-col space-y-4 bg-gray-700 p-6 rounded">
        {renderContent()}
      </div>
    </div>
    <div className="flex flex-col w-full lg:w-1/3 p-4 lg:p-8 bg-black text-white">
      <div className="flex justify-center mb-8 p-4 bg-primary text-center rounded items-center">
        <Link href="/" className="text-black hover:underline">
          ANNOUNCEMENT!
        </Link>
      </div>
      <div className="p-6 bg-primary text-center rounded">
        STATUS
        <div className="mt-4">
          <div className="relative w-24 h-24 mx-auto">
            <svg className="absolute inset-0 w-full h-full">
              <circle cx="50%" cy="50%" r="45%" stroke="black" strokeWidth="10" fill="none" />
              <circle cx="50%" cy="50%" r="45%" stroke="orange" strokeWidth="10" strokeDasharray="calc(282.6 * 0.25) 282.6" fill="none" />
            </svg>
=======
    <div className="flex flex-center">
      <div className="flex flex-col w-2/3 p-8 bg-gray-800 text-white">
        <div className="flex space-x-4 mb-8">
          <button
            className={`p-4 rounded ${selectedTab === 'logs' ? 'bg-primary text-black' : 'bg-gray-600'}`}
            onClick={() => setSelectedTab('logs')}
          >
            Logs
          </button>
          <button
            className={`p-4 rounded ${selectedTab === 'vehicles' ? 'bg-primary text-black' : 'bg-gray-600'}`}
            onClick={() => setSelectedTab('vehicles')}
          >
            Vehicles
          </button>
          <button
            className={`p-4 rounded ${selectedTab === 'delete' ? 'bg-primary text-black' : 'bg-gray-600'}`}
            onClick={() => setSelectedTab('delete')}
          >
            Delete
          </button>
          <button
            className={`p-4 rounded ${selectedTab === 'configure' ? 'bg-primary text-black' : 'bg-gray-600'}`}
            onClick={() => setSelectedTab('configure')}
          >
            Configure
          </button>
        </div>
        <div className="flex flex-col space-y-4 bg-gray-700 p-6 rounded">
          {renderContent()}
        </div>
      </div>
      <div className="flex flex-col w-1/3 p-8 bg-black text-white">     
        <div className="mb-8 p-6 bg-primary text-center rounded">ANNOUNCEMENT!</div>
        <div className="p-6 bg-gray-600 text-center rounded">
          STATUS
          <div className="mt-4">
            <div className="relative w-24 h-24 mx-auto">
              <svg className="absolute inset-0 w-full h-full">
                <circle cx="50%" cy="50%" r="45%" stroke="black" strokeWidth="10" fill="none" />
                <circle cx="50%" cy="50%" r="45%" stroke="orange" strokeWidth="10" strokeDasharray="calc(282.6 * 0.25) 282.6" fill="none" />
              </svg>
            </div>
>>>>>>> 40747e5c2cadceabc7427188d1b760da293799bb
          </div>
        </div>
      </div>
    </div>
<<<<<<< HEAD
  </div>
</div>


=======
>>>>>>> 40747e5c2cadceabc7427188d1b760da293799bb
  );
};

export default DashboardLayout;
