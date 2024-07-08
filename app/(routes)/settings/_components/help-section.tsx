import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HelpSection = () => {
  return (
    <div className="bg-transparent">
      <div className="relative w-full max-w-md mx-auto p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
        <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
          Help & Support
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2 text-primary">
              Frequently Asked Questions
            </label>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>How to change password?</AccordionTrigger>
                <AccordionContent>
                  Go to Password tab in settings.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  How to update profile information?
                </AccordionTrigger>
                <AccordionContent>
                  Go to Account tab in settings.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How to know available parking spaces?
                </AccordionTrigger>
                <AccordionContent>
                  Go to Parking Map and click the area you want to view.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
