"use client";
import { useState } from "react";
import { Settings } from "lucide-react";

import { Heading } from "@/app/(routes)/_components/heading";
import { Spinner } from "@/components/spinner";

import { Button } from "@/components/ui/button";
import useUserState from "@/hooks/useUserState";
import AccountInformation from "./_components/account-information-section";
import ChangePassword from "./_components/change-password-section";
import NotificationSection from "./_components/notifications-section";
import HelpSection from "./_components/help-section";

const SettingsPage = () => {
  const { userId, loading } = useUserState();
  const [activeSection, setActiveSection] = useState<
    "account" | "password" | "help"
  >("account");

  const handleSectionChange = (
    section: "account" | "password" | "help"
  ) => {
    setActiveSection(section);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 md:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {!loading && userId && (
        <div className="p-4 lg:px-16 space-y-4 pt-4">
          <div className="flex items-center gap-x-2 mr-auto pl-4">
            <Settings className="w-10 h-10 text-primary" />
            <div>
              <Heading
                title="Settings"
                description="Manage account settings."
              />
            </div>
          </div>

          <div className="px-4 lg:px-16 space-y-4 pt-4">
            <nav className="flex space-x-4 border-b pb-2 flex-nowrap overflow-x-auto">
              <Button
                variant={activeSection === "account" ? "clicked" : "notclicked"}
                onClick={() => handleSectionChange("account")}
              >
                Account
              </Button>
              <Button
                variant={
                  activeSection === "password" ? "clicked" : "notclicked"
                }
                onClick={() => handleSectionChange("password")}
              >
                Password
              </Button>
              <Button
                variant={activeSection === "help" ? "clicked" : "notclicked"}
                onClick={() => handleSectionChange("help")}
              >
                Help
              </Button>
            </nav>
            {activeSection === "account" && <AccountInformation />}
            {activeSection === "password" && <ChangePassword />}
            {activeSection === "help" && <HelpSection />}
          </div>
        </div>
      )}
    </>
  );
};
export default SettingsPage;
