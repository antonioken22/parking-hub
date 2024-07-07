import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./mobile-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

const Navbar = async () => {
  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end space-x-4">
        <Link href="/booking">
          <Button>Book a Parking Slot</Button>
        </Link>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
