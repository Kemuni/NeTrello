"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface CardProps {
  issue: any;
}

const Card: React.FC<CardProps> = ({ issue }) => {
  const router = useRouter();

  const handleCardClick = () => {
    const encodedIssue = encodeURIComponent(JSON.stringify(issue));
    router.push(`/boards/${issue.project_id}/issues?issue=${encodedIssue}`);
  };

  return (
    <div
      className="flex justify-center items-center w-full relative cursor-pointer"
      onClick={handleCardClick}
    >
      <img src="/packet.png" alt="packett" className="w-[60%]" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[70%] w-[50%] max-w-[400px] text-center bg-gray-300 rounded-lg shadow-md">
        <p className="my-2">Название: {issue.title}</p>
        <p>Автор: {issue.author.name}</p>
        <p>Метки: {issue.labels.join(", ")}</p>
      </div>
    </div>
  );
};

export default Card;