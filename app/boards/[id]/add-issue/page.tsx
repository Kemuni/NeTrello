"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCreateIssue } from "../../../../services/gitlab";

export default function AddIssuePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { createIssue, isLoading } = useCreateIssue();
  const [error, setError] = useState("");

  const { id } = params;
  const listLabel = params.label;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    labels: listLabel ? [listLabel] : []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // @ts-ignore
    if (!session?.accessToken || !id) {
      setError("Необходима авторизация");
      return;
    }

    try {
      await createIssue(
        // @ts-ignore
        session.accessToken,
        Number(id),
        formData.title,
        formData.description,
        formData.due_date,
        // @ts-ignore
        formData.labels
      );
      router.push(`/boards/${id}`);
    } catch (err) {
      console.error("Ошибка при создании задачи:", err);
      setError("Не удалось создать задачу");
    }
  };

  return (
    <div className="monomakh-relative bg-cover bg-[url('/background-manage.jpg')] h-screen flex justify-center items-center">
      <Link
        href={`/boards/${id}`}
        className="absolute top-[10px] left-[10px] w-20 h-20 bg-red-500 text-white border-none rounded-full cursor-pointer"
      >
        <img src="/arrow-left.png" alt="arrow-left" className="w-full h-[80%]" />
      </Link>

      <div className="bg-gray-100 border p-8 rounded-lg shadow-lg w-[80%] max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Создать новую задачу</h1>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg mb-2">Название:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-lg mb-2">Описание:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-lg mb-2">Срок выполнения:</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {listLabel && (
            <div className="bg-gray-100 p-3 rounded">
              <p className="text-lg">Задача будет добавлена в колонку: <span className="font-bold">{listLabel}</span></p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => router.push(`/boards/${id}`)}
              className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? "Создание..." : "Создать задачу"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
