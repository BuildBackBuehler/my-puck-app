'use client';

import { Config } from "@measured/puck";
import * as ToastPrimitive from "@radix-ui/react-toast";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";
import { CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { clsx } from "clsx";

export interface PollProps {
  question: string;
  choices: { text: string; votes: number }[];
  allowCustomChoice: boolean;
  submitButtonText: string;
  toastTitle: string;
  toastMessage: string;
}

export const Poll: Config["components"]["Poll"] = {
  fields: {
    question: { type: "text" },
    choices: {
      type: "array",
      arrayFields: {
        text: { type: "text" },
        votes: { type: "number" }
      },
      defaultItemProps: {
        text: "New choice",
        votes: 0
      }
    },
    allowCustomChoice: {
      type: "radio",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false }
      ]
    },
    submitButtonText: { type: "text" },
    toastTitle: { type: "text" },
    toastMessage: { type: "text" }
  },

  defaultProps: {
    question: "What is your favorite programming language?",
    choices: [
      { text: "JavaScript", votes: 0 },
      { text: "Python", votes: 0 },
      { text: "Java", votes: 0 },
      { text: "C++", votes: 0 }
    ],
    allowCustomChoice: true,
    submitButtonText: "Submit Vote",
    toastTitle: "Thank you!",
    toastMessage: "Your vote has been recorded."
  },

  render: ({ 
    question,
    choices: initialChoices,
    allowCustomChoice,
    submitButtonText,
    toastTitle,
    toastMessage
  }) => {
    const [choices, setChoices] = useState(initialChoices);
    const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
    const [customChoice, setCustomChoice] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    const totalVotes = choices.reduce((sum, choice) => sum + choice.votes, 0);

    const handleCheckboxChange = (choice: string) => {
      setSelectedChoices(prev => 
        prev.includes(choice) 
          ? prev.filter(c => c !== choice)
          : [...prev, choice]
      );
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const updatedChoices = choices.map(choice => ({
        ...choice,
        votes: selectedChoices.includes(choice.text) 
          ? choice.votes + 1 
          : choice.votes
      }));

      if (customChoice) {
        updatedChoices.push({ text: customChoice, votes: 1 });
      }

      setChoices(updatedChoices);
      setShowResults(true);
      setToastOpen(true);
    };

    return (
      <div className="max-w-lg mx-auto p-0.5 sm:p-1 md:p-6">
        <h2 className="text-xs sm:text-base lg:text-xl sm:font-bold mb-4 text-adaptive-secondary">{question}</h2>
        
        {!showResults ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {choices.map((choice, index) => (
              <div key={index} className="flex items-center">
                <CheckboxPrimitive.Root
                  id={`choice-${index}`}
                  checked={selectedChoices.includes(choice.text)}
                  onCheckedChange={() => handleCheckboxChange(choice.text)}
                  className={clsx(
                    "flex h-2.5 w-2.5 md:h-5 md:w-5 items-center justify-center rounded",
                    "radix-state-checked:bg-adaptive-accent text-adaptive-accent3",
                    "radix-state-unchecked:bg-adaptive-primaryAlt",
                    "focus:outline-none focus-visible:ring focus-visible:ring-adaptive-accent3 focus:drop-shadow-glowY"
                  )}
                >
                  <CheckboxPrimitive.Indicator>
                    <CheckIcon className="h-2.5 w-2.5 md:h-4 md:w-4 self-center text-adaptive-primary" />
                  </CheckboxPrimitive.Indicator>
                </CheckboxPrimitive.Root>
                
                <LabelPrimitive.Label
                  htmlFor={`choice-${index}`}
                  className="ml-3 text-adaptive-secondary text-3xs sm:text-xs md:text-base"
                >
                  {choice.text}
                </LabelPrimitive.Label>
              </div>
            ))}

            {allowCustomChoice && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Other (please specify)"
                  value={customChoice}
                  onChange={(e) => {
                    setCustomChoice(e.target.value);
                    setSelectedChoices([]);
                  }}
                  className="text-3xs md:text-base w-3/4 md:w-full p-2 border rounded bg-adaptive-primary text-adaptive-secondary 
                    focus-visible:ring focus-visible:ring-adaptive-accent3
                    focus:w-full transition-all duration-300 ease-in-out
                    hover:w-full focus-visible:drop-shadow-glowY"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={selectedChoices.length === 0 && !customChoice}
              className={clsx(
                "mt-1 px-1 py-0.5 sm:mt-2 md:mt-4 sm:px-2 md:px-4 sm:py-1 md:py-2 rounded text-adaptive-primary text-3xs md:text-base",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200 ease-in-out",
                selectedChoices.length > 0 || customChoice
                  ? "bg-adaptive-accent hover:bg-opacity-90 hover:bg-adaptive-accent3 hover:drop-shadow-glowY hover:scale-[1.02]"
                  : "bg-adaptive-secondary"
              )}
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {choices.map((choice, index) => (
              <div key={index} className="relative pt-1">
                <div className="flex mb-2 justify-between items-center">
                  <div className="text-adaptive-secondary">
                    {choice.text}
                  </div>
                  <div className="text-adaptive-secondary">
                    {Math.round((choice.votes / totalVotes) * 100)}%
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-adaptive-primary">
                  <div
                    style={{ width: `${(choice.votes / totalVotes) * 100}%` }}
                    className="bg-adaptive-accent"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <ToastPrimitive.Provider swipeDirection="right">
          <ToastPrimitive.Root
            open={toastOpen}
            onOpenChange={setToastOpen}
            className={clsx(
              "z-50 fixed bottom-16 right-16 w-auto max-w-2xl shadow-lg rounded-lg bg-adaptive-secondary",
              "radix-state-closed:animate-toast-hide",
              "radix-state-open:animate-toast-slide-in-bottom md:animate-toast-slide-in-right"
            )}
          >
            <div className="flex p-4">
              <div className="w-32 flex-1">
                <ToastPrimitive.Title className="text-lg font-semibold text-adaptive-primary">
                  {toastTitle}
                </ToastPrimitive.Title>
                <ToastPrimitive.Description className="mt-1 text-adaptive-accent">
                  {toastMessage}
                </ToastPrimitive.Description>
              </div>
            </div>
          </ToastPrimitive.Root>
          <ToastPrimitive.Viewport />
        </ToastPrimitive.Provider>
      </div>
    );
  }
};

export default Poll;