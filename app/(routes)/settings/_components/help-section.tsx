import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import useFAQ from "@/hooks/useFAQ";
import useUserState from "@/hooks/useUserState";
import { FAQ } from "@/types/FAQs";

const HelpSection = () => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useFAQ();
  const { userRole } = useUserState();
  const [searchQuery, setSearchQuery] = useState("");
  const [newFAQ, setNewFAQ] = useState<Partial<FAQ>>({
    question: "",
    answer: "",
  });
  const [editFAQ, setEditFAQ] = useState<FAQ | null>(null);

  const handleAddFAQ = async () => {
    try {
      if (newFAQ.question && newFAQ.answer) {
        const typedNewFAQ: Omit<FAQ, "id"> = {
          question: newFAQ.question,
          answer: newFAQ.answer,
        };
        await addFAQ(typedNewFAQ);
        toast.success("FAQ added successfully");
        setNewFAQ({ question: "", answer: "" });
      } else {
        toast.error("Please fill out both question and answer fields");
      }
    } catch (error) {
      console.error("Error adding FAQ:", error);
      toast.error("Failed to add FAQ");
    }
  };

  const handleUpdateFAQ = async () => {
    try {
      if (editFAQ && editFAQ.question && editFAQ.answer) {
        if (userRole === "manager" || userRole === "admin") {
          await updateFAQ(editFAQ);
          toast.success("FAQ updated successfully");
          setEditFAQ(null);
        } else {
          toast.error("Only managers and admins can update FAQs.");
        }
      } else {
        toast.error("Please fill out both question and answer fields");
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Failed to update FAQ");
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    try {
      if (userRole === "manager" || userRole === "admin") {
        setEditFAQ(null);
        await deleteFAQ(id);
        toast.success("FAQ deleted successfully");
      } else {
        toast.error("Only managers and admins can delete FAQs.");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ");
    }
  };

  const handleCancel = () => {
    setEditFAQ(null);
    setNewFAQ({ question: "", answer: "" });
  };

  const filteredItems = faqs.filter(
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
            <div>
              <Accordion type="single" collapsible>
                {filteredItems.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                      {(userRole === "manager" || userRole === "admin") && (
                        <div className="flex justify-end mt-2">
                          <Button
                            variant="link"
                            className="text-blue-500"
                            onClick={() => setEditFAQ(faq)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="link"
                            className="text-red-500"
                            onClick={() => handleDeleteFAQ(faq.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
        {(userRole === "manager" || userRole === "admin") && (
          <div className="mt-4">
            <h3 className="text-lg font-thin text-center font-roboto text-primary">
              {editFAQ ? "Update FAQ" : "Add FAQ"}
            </h3>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div>
                <label className="text-sm font-medium block mb-2 text-primary">
                  Question
                </label>
                <input
                  type="text"
                  value={editFAQ ? editFAQ.question : newFAQ.question}
                  onChange={(e) =>
                    editFAQ
                      ? setEditFAQ({ ...editFAQ, question: e.target.value })
                      : setNewFAQ({ ...newFAQ, question: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mb-4 text-muted-foreground text-sm"
                  placeholder="Enter question"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2 text-primary">
                  Answer
                </label>
                <textarea
                  value={editFAQ ? editFAQ.answer : newFAQ.answer}
                  onChange={(e) =>
                    editFAQ
                      ? setEditFAQ({ ...editFAQ, answer: e.target.value })
                      : setNewFAQ({ ...newFAQ, answer: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded mb-4 text-muted-foreground text-sm"
                  placeholder="Enter answer"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button
                  className="ml-2"
                  onClick={editFAQ ? handleUpdateFAQ : handleAddFAQ}
                >
                  {editFAQ ? "Update FAQ" : "Add FAQ"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpSection;
