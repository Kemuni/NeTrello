"use client";

import React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

export default function Issue() {
  const params = useParams();
  const searchParams = useSearchParams();

  const { id } = params;

  const issue = searchParams.get("issue");
  const parsedIssue = issue ? JSON.parse(decodeURIComponent(issue)) : null;

  return (
    <div className="relative bg-cover bg-[url('/background-manage.jpg')] h-screen flex justify-center items-center">
      <Link href={`/boards/${id}`}>
        <button className="absolute top-[10px] left-[10px] w-20 h-20 bg-red-500 text-white border-none rounded-full cursor-pointer">
          <img src="/arrow-left.png" alt="arrow-left" className="w-full h-[80%]" />
        </button>
      </Link>

      <div className="flex flex-col w-[85%] h-full justify-around items-center pb-2">
        <p className="text-5xl text-white monomakh-regular">Название</p>
        <div className="bg-[rgba(124,124,124,0.5)] w-[85%] h-[85%] rounded-2xl border-4 border-gray-300 flex flex-col content-start items-center flex-shrink-0">
          <img src="/packet.png" alt="packett" className="w-[72%]" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/7 h-[60%] w-[60%] max-w-[550px] text-center bg-gray-300 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              <p className="text-3xl">{parsedIssue?.title}</p>
              <div className="flex flex-col items-start monomakh-regular gap-2 text-2xl px-3">
                <p>Задача закреплена за: {parsedIssue?.author?.name}</p>
                <p>Описание задачи: {parsedIssue?.description}</p>
                <p>Срок выполнения: {parsedIssue?.due_date}</p>
              </div>
            </div>
            <div className="flex flex-row justify-between px-5 pb-4 text-white text-s">
              <button className="w-[100px] py-1 rounded-md bg-gray-400 justify-center">Удалить</button>
              <div className="flex flex-row gap-7">
                <Link href={`/boards/${id}/issues/edit?issue=${encodeURIComponent(issue)}`}>
                <div className="w-[100px] py-1 rounded-md bg-gray-400 justify-center">Изменить</div>
                </Link>
                <button className="w-[100px] py-1 rounded-md bg-gray-400 justify-center">Завершить</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}