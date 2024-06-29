import { MobileSidebar } from "./mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";

const Navbar = async () => {
  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end space-x-4">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
