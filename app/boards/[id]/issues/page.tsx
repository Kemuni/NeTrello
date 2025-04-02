"use client"; // Убедитесь, что компонент является клиентским

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

export default function Issue() {
  const params = useParams(); // Получаем динамические параметры маршрута
  const searchParams = useSearchParams(); // Получаем параметры запроса
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Получаем id из параметров маршрута
  const { id } = params;

  // Получаем данные о issue из параметров запроса и декодируем их
  const issue = searchParams.get("issue");
  const parsedIssue = issue ? JSON.parse(decodeURIComponent(issue)) : null;

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const simulateDeletion = () => {
    setIsDeleting(true);
    // Имитация процесса удаления (3 секунды)
    setTimeout(() => {
      setIsDeleting(false);
      setShowModal(false);
    }, 3000);
  };


  return (
      <div className="relative bg-cover bg-[url('/background-manage.jpg')] h-screen flex justify-center items-center">
          {/* Модалка */}
          {showModal && (
              <div className="fixed inset-0 bg-[rgba(49,49,49,0.8)] bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-md w-full">
                  <h3 className="text-xl font-bold mb-4 monomakh-regular">Удаление задачи</h3>

                  {isDeleting ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500 mb-4"></div>
                        <p className="monomakh-regular">Удаление...</p>
                      </div>
                  ) : (
                      <>
                        <p className="mb-6 monomakh-regular">Вы действительно хотите удалить эту задачу?</p>
                        <div className="flex justify-end space-x-3">
                          <button
                              onClick={() => setShowModal(false)}
                              className="text-white w-[100px] py-1 rounded-md bg-gray-400 hover:bg-gray-500 justify-center monomakh-regular"
                          > Отмена
                          </button>
                          <button
                              onClick={simulateDeletion}
                              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 monomakh-regular"
                          >
                            Удалить
                          </button>
                        </div>
                      </>
                  )}
                </div>
              </div>
          )}

          <Link href={`/boards/${id}`}>
            <button
                className="absolute top-[10px] left-[10px] w-20 h-20 bg-red-500 text-white border-none rounded-full cursor-pointer">
              <img src="/arrow-left.png" alt="arrow-left" className="w-full h-[80%]"/>
            </button>
          </Link>

          <div className="flex flex-col w-[85%] h-full justify-around items-center pb-2">
            <p className="text-5xl text-white monomakh-regular">Название</p>
            <div
                className="bg- w-[85%] h-[85%] rounded-2xl border-4 border-gray-300 flex flex-col content-start items-center flex-shrink-0">
              <img src="/packet.png" alt="packett" className="w-[60%]"/>
              <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/7 h-[60%] w-[60%] max-w-[550px] text-center bg-gray-300 rounded-lg shadow-md flex flex-col justify-between">
                <div>
                  <p className="text-3xl">{parsedIssue?.title}</p>
                  <div className="flex flex-col items-start monomakh-regular gap-2 text-2xl px-3">
                    <p>Задача закреплена за: {parsedIssue?.author?.name}</p>
                    <p>Описание задачи: {parsedIssue?.description}</p>
                    <p>Срок выполнения: {parsedIssue?.due_date}</p>
                  </div>
                </div>
                <div className="flex flex-row justify-between px-5 pb-4 text-white text-s">
                  <button onClick={handleDeleteClick}
                          className="w-[100px] py-1 rounded-md bg-gray-400 hover:bg-gray-500 justify-center monomakh-regular"> Удалить
                  </button>
                  <div className="flex flex-row gap-7">
                    <button
                        className="w-[100px] py-1 rounded-md bg-gray-400 hover:bg-gray-500 justify-center monomakh-regular">
                      Изменить
                    </button>
                    <button
                        className="w-[100px] py-1 rounded-md bg-gray-400 hover:bg-gray-500 justify-center monomakh-regular">Завершить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

  );
}