"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUpdateIssue, useFetchProjectMembers, useFetchProjectLabels } from "../../../../../services/gitlab";

interface TaskCardProps {
  id: number;
  title: string;
  author?: {
    name: string;
    id: number;
  };
  assignee?: {
    name: string;
    id: number;
  } | null;
  description: string;
  due_date: string;
  labels: string[];
}

export default function Edit() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { updateIssue, isLoading: isSaving } = useUpdateIssue();
  const { members, fetchMembers } = useFetchProjectMembers();
  const { labels, fetchLabels } = useFetchProjectLabels();
  const [error, setError] = useState("");

  const { id } = params;
  const issue = searchParams.get("issue");
  const initialIssue = issue ? JSON.parse(decodeURIComponent(issue)) : null;

  const [editedIssue, setEditedIssue] = useState<TaskCardProps>({
    id: initialIssue?.iid || 0,
    title: initialIssue?.title || "",
    author: initialIssue?.author || null,
    assignee: initialIssue?.assignee || null,
    description: initialIssue?.description || "",
    due_date: initialIssue?.due_date || "",
    labels: initialIssue?.labels || []
  });

  // Загрузка участников проекта и меток
  useEffect(() => {
    // @ts-ignore
    if (session?.accessToken && id) {
      // @ts-ignore
      fetchMembers(session.accessToken, Number(id));
      // @ts-ignore
      fetchLabels(session.accessToken, Number(id));
    }
    // @ts-ignore
  }, [session?.accessToken, id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedIssue({...editedIssue, title: e.target.value});
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selectedMember = members.find(m => m.id === selectedId);
    setEditedIssue({
      ...editedIssue,
      assignee: selectedMember || null
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedIssue({...editedIssue, description: e.target.value});
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedIssue({...editedIssue, due_date: e.target.value});
  };

  const handleLabelsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setEditedIssue({...editedIssue, labels: selectedOptions});
  };

  const handleSave = async () => {
    // @ts-ignore
    if (!session?.accessToken || !id || !editedIssue.id) {
      setError("Недостаточно данных для сохранения");
      return;
    }

    setError("");

    try {
      await updateIssue(
        // @ts-ignore
        session.accessToken,
        Number(id),
        editedIssue.id,
        {
          title: editedIssue.title,
          description: editedIssue.description,
          due_date: editedIssue.due_date,
          assignee_ids: editedIssue.assignee ? [editedIssue.assignee.id] : [],
          labels: editedIssue.labels
        }
      );
      router.push(`/boards/${id}`);
    } catch (err) {
      console.error("Ошибка при сохранении задачи:", err);
      setError("Не удалось сохранить изменения");
    }
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
          zIndex: 2,
          width: '100%'
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
              style={{
                color: '#773306',
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

          {error && (
            <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ fontSize: '32px', marginTop: '20px' }}>
            <label>Задача закреплена за:</label>
            <select
              value={editedIssue.assignee?.id || ''}
              onChange={handleAssigneeChange}
              style={{
                border: 'black solid 1px',
                fontSize: '32px',
                width: '100%',
                padding: '5px',
                marginTop: '10px',
                borderRadius: '5px'
              }}
            >
              <option value="">Не назначено</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '32px', marginTop: '20px' }}>
            <label>Метки:</label>
            <select
              multiple
              value={editedIssue.labels}
              onChange={handleLabelsChange}
              style={{
                border: 'black solid 1px',
                fontSize: '32px',
                width: '100%',
                padding: '5px',
                marginTop: '10px',
                borderRadius: '5px',
                height: 'auto',
                minHeight: '100px'
              }}
            >
              {labels.map(label => (
                <option key={label.name} value={label.name}>
                  {label.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '32px', marginTop: '20px' }}>
            <label>Описание задачи:</label>
            <textarea
              value={editedIssue.description}
              onChange={handleDescriptionChange}
              style={{
                border: 'black solid 1px',
                fontSize: '32px',
                width: '100%',
                padding: '5px',
                marginTop: '10px',
                borderRadius: '5px',
                minHeight: '100px'
              }}
            />
          </div>

          <div style={{ fontSize: '32px', marginTop: '20px' }}>
            <label>Срок выполнения:</label>
            <input
              type="date"
              value={editedIssue.due_date}
              onChange={handleDueDateChange}
              style={{
                border: 'black solid 1px',
                fontSize: '32px',
                width: '100%',
                padding: '5px',
                marginTop: '10px',
                borderRadius: '5px'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '35px' }}>
            <button
              onClick={() => router.push(`/boards/${id}`)}
              style={{
                backgroundColor: '#ddd',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '23px'
              }}
              disabled={isSaving}
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
                fontSize: '23px'
              }}
              disabled={isSaving}
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}