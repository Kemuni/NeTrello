"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { deleteGitLabIssue, updateGitLabIssue } from "../../../../services/gitlab";
import { useSession } from "next-auth/react";

export default function Issue() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"delete" | "close">("delete");

  const { id } = params;
  const issue = searchParams.get("issue");
  const parsedIssue = issue ? JSON.parse(decodeURIComponent(issue)) : null;

  const handleDeleteClick = () => {
    setModalType("delete");
    setShowModal(true);
  };

  const handleCloseClick = () => {
    setModalType("close");
    setShowModal(true);
  };

  const handleDeleteIssue = async () => {
    // @ts-ignore
    if (!session?.accessToken || !parsedIssue?.iid || !id) {
      router.push(`/boards/${id}`);
      return;
    }

    setIsDeleting(true);

    try {
      // @ts-ignore
      await deleteGitLabIssue(session.accessToken, id.toString(), parsedIssue.iid);
      router.push(`/boards/${id}`);
    } catch (err) {
      console.error("Ошибка при удалении задачи:", err);
      alert("Не удалось удалить задачу");
    } finally {
      setIsDeleting(false);
      setShowModal(false);
    }
  };

  const handleCloseIssue = async () => {
    // @ts-ignore
    if (!session?.accessToken || !parsedIssue?.iid || !id) {
      router.push(`/boards/${id}`);
      return;
    }

    setIsClosing(true);

    try {
      await updateGitLabIssue(
        // @ts-ignore
        session.accessToken,
        id.toString(),
        parsedIssue.iid,
        { state_event: "close" }
      );
      router.push(`/boards/${id}`);
    } catch (err) {
      console.error("Ошибка при завершении задачи:", err);
      alert("Не удалось завершить задачу");
    } finally {
      setIsClosing(false);
      setShowModal(false);
    }
  };

  const handleConfirm = () => {
    if (modalType === "delete") {
      handleDeleteIssue();
    } else {
      handleCloseIssue();
    }
  };

  const modalTitle = modalType === "delete" ? "Удаление задачи" : "Завершение задачи";
  const modalText = modalType === "delete"
    ? "Вы действительно хотите удалить эту задачу?"
    : "Вы действительно хотите завершить эту задачу?";
  const actionInProgress = modalType === "delete" ? isDeleting : isClosing;
  const actionText = modalType === "delete" ? "Удаление..." : "Завершение...";

  return (
    <div className="relative bg-cover bg-[url('/background-manage.jpg')] h-screen flex justify-center items-center">
      {showModal && (
        <div className="fixed inset-0 bg-[rgba(49,49,49,0.8)] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-200 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 monomakh-regular">{modalTitle}</h3>

            {actionInProgress ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-500 mb-4"></div>
                <p className="monomakh-regular">{actionText}</p>
              </div>
            ) : (
              <>
                <p className="mb-6 monomakh-regular">{modalText}</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white w-[100px] py-1 rounded-md bg-gray-400 hover:bg-gray-500 justify-center monomakh-regular"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 monomakh-regular"
                  >
                    {modalType === "delete" ? "Удалить" : "Завершить"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Link href={`/boards/${id}`}>
        <button className="absolute top-[10px] left-[10px] w-20 h-20 bg-red-500 text-white border-none rounded-full cursor-pointer">
          <img src="/arrow-left.png" alt="arrow-left" className="w-full h-[80%]"/>
        </button>
      </Link>

      <div className="flex flex-col w-[85%] h-full justify-around items-center pb-2">
        <div className="relative w-[85%] h-[85%] rounded-2xl border-4 border-gray-300 flex justify-center items-center">
          <img
            src="/packet.png"
            alt="packet"
            className="absolute w-full h-full object-contain z-0"
          />

          <div
            className="relative z-10 h-[60%] w-[60%] max-w-[550px] text-center bg-gray-300 rounded-lg shadow-md flex flex-col justify-between p-4">
            <div>
              <p className="text-3xl">{parsedIssue?.title}</p>
              <div className="flex flex-col items-start monomakh-regular gap-2 text-2xl px-3">
                <p>Задача закреплена за: {parsedIssue?.author?.name}</p>
                <p>Описание задачи: {parsedIssue?.description}</p>
                <p>Срок выполнения: {parsedIssue?.due_date}</p>
                {parsedIssue?.state === "closed" && (
                  <p className="text-green-600 font-bold">Статус: Завершена</p>
                )}
              </div>
            </div>
            <div className="flex flex-row justify-between px-5 pb-4 text-white text-s">
              <button
                onClick={handleDeleteClick}
                className="w-[100px] py-1 rounded-md bg-gray-400 hover:bg-gray-500 justify-center monomakh-regular"
              >
                Удалить
              </button>
              <div className="flex flex-row gap-7">
                <Link href={`/boards/${id}/issues/edit?issue=${encodeURIComponent(issue)}`}>
                  <button
                    className="w-[100px] py-1 rounded-md bg-gray-400 hover:bg-gray-500 justify-center monomakh-regular">
                    Изменить
                  </button>
                </Link>
                {parsedIssue?.state !== "closed" && (
                  <button
                    onClick={handleCloseClick}
                    className="w-[100px] py-1 rounded-md bg-gray-400 hover:bg-gray-500 justify-center monomakh-regular"
                  >
                    Завершить
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}