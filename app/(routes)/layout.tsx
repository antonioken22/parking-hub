import Navbar from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen relative">
      <div className="hidden h-screen lg:flex lg:w-56 lg:flex-col lg:fixed lg:inset-y-0 z-80 ">
        <Sidebar />
      </div>
      <Navbar />
      <main className="lg:pl-56 pb-10">{children}</main>
    </div>
  );
};

export default DashboardLayout;
