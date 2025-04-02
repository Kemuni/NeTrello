"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";

interface TaskCardProps {
  id: number;
  title: string;
  author?: {
    name: string;
  };
  assignee?: {
    name: string;
  } | null;
  description: string;
  due_date: string;
}

export default function Edit() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { id } = params;
  const issue = searchParams.get("issue");
  const initialIssue = issue ? JSON.parse(decodeURIComponent(issue)) : null;

  // Состояние для хранения измененных данных
  const [editedIssue, setEditedIssue] = useState<TaskCardProps>({
    id: initialIssue?.id || 0,
    title: initialIssue?.title || "",
    author: initialIssue?.author || null,
    assignee: initialIssue?.assignee || null,
    description: initialIssue?.description || "",
    due_date: initialIssue?.due_date || ""
  });

  // Обработчики изменений полей
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedIssue({...editedIssue, title: e.target.value});
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedIssue({
      ...editedIssue,
      assignee: e.target.value ? { name: e.target.value } : null
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedIssue({...editedIssue, description: e.target.value});
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedIssue({...editedIssue, due_date: e.target.value});
  };

  // Функция для сохранения изменений (вывод в консоль)
  const handleSave = () => {
    console.log("Сохраненные данные:", {
      id: editedIssue.id,
      title: editedIssue.title,
      assignee: editedIssue.assignee?.name || "Не назначен",
      description: editedIssue.description,
      due_date: editedIssue.due_date
    });

    // Можно добавить уведомление об успешном "сохранении"
    alert("Данные сохранены (выведены в консоль)");

    // Возврат на предыдущую страницу (по желанию)
    // router.push(`/boards/${id}`);
  };

  // Функция для получения имени исполнителя
  const getAssigneeName = () => {
    if (editedIssue.assignee) {
      return editedIssue.assignee.name;
    }
    if (editedIssue.author) {
      return editedIssue.author.name;
    }
    return "";
  };

  return (
    <div style={{
      position: 'relative',
      backgroundImage: "url('/imagege.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        position: 'relative',
        width: '60%',
        margin: '20px auto',
        fontFamily: 'Monomakh, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <img
          src="/packet.png"
          alt="packett"
          style={{
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            right: '-20px',
            bottom: '-20px',
            width: 'calc(100% + 40px)',
            height: 'calc(100% + 40px)',
            zIndex: 1,
            borderRadius: '10px'
          }}
        />
        <div style={{
          position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid #ccc',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 2
        }}>
          <h2 style={{
            color: '#333',
            fontSize: '50px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <input
              type="text"
              value={editedIssue.title}
              onChange={handleTitleChange}
              style={{color: '#773306',
                fontSize: '50px',
                width: '100%',
                border: 'none',
                borderBottom: '1px solid #ccc',
                outline: 'none',
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            />
          </h2>

          <p style={{ fontSize: '32px', marginTop: '20px' }}>
            Задача закреплена за:
            <br />
            <input
              type="text"
              value={getAssigneeName()}
              onChange={handleAssigneeChange}
              style={{
                color: '#773306',
                fontSize: '32px',
                width: '100%',
                border: 'none',
                borderBottom: '1px solid #ccc',
                outline: 'none'
              }}
            />
          </p>

          <p style={{ fontSize: '32px', marginTop: '20px' }}>
            Описание задачи:
            <br />
            <input
              type="text"
              value={editedIssue.description}
              onChange={handleDescriptionChange}
              style={{
                color: '#773306',
                fontSize: '32px',
                width: '100%',
                border: 'none',
                borderBottom: '1px solid #ccc',
                outline: 'none'
              }}
            />
          </p>

          <p style={{ fontSize: '32px', marginTop: '20px' }}>
            Срок выполнения:
            <input
              type="date"
              value={editedIssue.due_date}
              onChange={handleDueDateChange}
              style={{
                color: '#773306',
                fontSize: '32px',
                width: '100%',
                border: 'none',
                borderBottom: '1px solid #ccc',
                outline: 'none'
              }}
            />
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => router.push(`/boards/${id}`)}
              style={{
                backgroundColor: '#ddd',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '23px',
                marginTop: '35px'
              }}
            >
              Отменить
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '23px',
                marginTop: '35px'
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}