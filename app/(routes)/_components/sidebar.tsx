"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Car,
  FileClock,
  LayoutDashboard,
  LogOut,
  Settings,
  SquareParking,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { auth } from "@/firebase/config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "text-primary",
    href: "/dashboard",
  },
  {
    label: "My Vehicles",
    icon: Car,
    color: "text-primary",
    href: "/my-vehicles",
  },
  {
    label: "Parking Map",
    icon: SquareParking,
    color: "text-primary",
    href: "/parking-map",
  },
  {
    label: "Parking History",
    icon: FileClock,
    color: "text-primary",
    href: "/parking-history",
  },
  {
    label: "Settings",
    icon: Settings,
    color: "text-primary",
    href: "/settings",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  const router = useRouter();

  const handleLogout = async () => {
    toast.promise(
      async () => {
        try {
          await signOut(auth);
          router.push("/sign-in");
        } catch (error) {
          // throw new Error("Error signing out.");
        }
      },
      {
        loading: "Signing out...",
        success: "Signed out successfully.",
        error: "Error signing out.",
      }
    );
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-gradient-to-b bg-muted">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 ">
            <Image
              loading="lazy"
              alt="Logo"
              src="/logo.svg"
              fill
              className="dark:hidden"
            />
            <Image
              loading="lazy"
              alt="Logo"
              src="/logo-dark.svg"
              fill
              className="hidden dark:block"
            />
          </div>
          <h2 className="w-full text-xl font-bold text-center text-primary">
            Parking{" "}
            <span className="bg-primary text-background border-primary-foreground px-2 rounded-sm">
              Hub
            </span>
          </h2>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-secondary-foreground hover:bg-secondary-foreground/10 rounded-lg transition",
                pathname === route.href
                  ? "text-secondary-foreground bg-secondary-foreground/10"
                  : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div
            role="button"
            className="mt-auto flex items-center justify-start px-6 py-2 "
          >
            <LogOut className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground ml-3">
              Sign Out
            </span>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to continue signing out?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
