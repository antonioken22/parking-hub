import Navbar from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen relative">
      <div className="hidden h-screen md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 z-50">
        <Sidebar />
      </div>
      <Navbar />
      <main className="md:pl-56 pb-10">{children}</main>
    </div>
  );
};

export default DashboardLayout;
