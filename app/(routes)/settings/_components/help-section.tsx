import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HelpSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const faqItems = [
    {
      value: "item-1",
      question: "How to change password?",
      answer: "Go to Password tab in settings.",
    },
    {
      value: "item-2",
      question: "How to update profile information?",
      answer: "Go to Account tab in settings.",
    },
    {
      value: "item-3",
      question: "How to know available parking spaces?",
      answer: "Go to Parking Map and click the area you want to view.",
    },
  ];

  const filteredItems = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-transparent">
      <div className="relative w-full max-w-md mx-auto p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
        <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
          Help & Support
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2 text-primary">
              Search FAQ
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 text-muted-foreground text-sm"
              placeholder="Type to search..."
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2 text-primary">
              Frequently Asked Questions
            </label>
            <Accordion type="single" collapsible>
              {filteredItems.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {filteredItems.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No matching results
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
