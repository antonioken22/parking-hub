import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const NotificationSection = () => {
  return (
    <div className="bg-transparent">
      <div className="relative w-full max-w-md mx-auto p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
        <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
          Notification Settings
        </h2>
        <div className="items-top flex space-x-2">
          <Checkbox id="terms1" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary"
            >
              Receive email notifications
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Important updates and alerts via email.
            </p>
          </div>
        </div>
        <div className="items-top flex space-x-2">
          <Checkbox id="terms2" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms2"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary"
            >
              Receive SMS notifications
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Updates and alerts directly to your phone via SMS.
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button type="button" className="text-xs md:text-base">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSection;
