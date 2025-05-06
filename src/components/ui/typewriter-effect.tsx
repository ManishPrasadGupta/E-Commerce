"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const TypewriterEffectSmooth = ({
  words,
  className,
  typingSpeed = 80,
  pauseSpeed = 1500,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
  typingSpeed?: number; 
  pauseSpeed?: number; 
}) => {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;

    if (!isDeleting && currentChar < words[currentWord].text.length) {
      typingTimeout = setTimeout(() => {
        setCurrentChar((c) => c + 1);
      }, typingSpeed);
    } else if (!isDeleting && currentChar === words[currentWord].text.length) {
      typingTimeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseSpeed);
    } else if (isDeleting && currentChar > 0) {
      typingTimeout = setTimeout(() => {
        setCurrentChar((c) => c - 1);
      }, typingSpeed / 2);
    } else if (isDeleting && currentChar === 0) {
      typingTimeout = setTimeout(() => {
        setIsDeleting(false);
        setCurrentWord((w) => (w + 1) % words.length);
      }, 500);
    }

    return () => clearTimeout(typingTimeout);
  }, [currentChar, isDeleting, words, currentWord, typingSpeed, pauseSpeed]);

  const display = words[currentWord].text.slice(0, currentChar);

  return (
    <div className={cn("flex justify-center items-center w-full my-4 px-2 max-w-full", className)}>
      <span
        className={cn(
          "text-white", 
          "text-base sm:text-lg md:text-xl font-semibold w-full text-center break-words whitespace-normal transition-all duration-300",
          words[currentWord].className
        )}
        style={{ letterSpacing: "0.05em" }}
      >
        {display}
      </span>
    </div>
  );
};