"use client";

import React from "react";
import Link from "next/link";
import Card from "./Card";

interface ListComponentProps {
  title: string;
  issues: any[];
  onDelete?: () => void;
  boardId: string;
  listLabel?: string;
}

const ListComponent: React.FC<ListComponentProps> = ({title, issues, onDelete, boardId, listLabel}) => {
  return (
    <div className="bg-[rgba(124,124,124,0.5)] w-[30%] h-full rounded-2xl border-4 border-gray-300 flex flex-col items-center pt-5 flex-shrink-0 overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-2">
        <h2 className="text-5xl text-white">{title}</h2>
        {onDelete && (
          <button
            onClick={onDelete}
            className="text-red-500 bg-white rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold hover:cursor-pointer"
            title="Удалить столбец"
          >
            ×
          </button>
        )}
      </div>

      {issues?.map((i) => <Card key={i.id} issue={i} />)}

      {title !== "Закрытые" && (
        <Link
          href={`/boards/${boardId}/add-issue?label=${listLabel || ''}`}
          className="mt-4 mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          + Добавить задачу
        </Link>
      )}
    </div>
  );
};

export default ListComponent;