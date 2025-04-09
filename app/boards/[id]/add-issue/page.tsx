"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
          <button
            onClick={() => router.push(`/boards/${id}`)}
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              zIndex: 3
            }}
          >
            <img src="/arrow-left.png" alt="arrow-left" style={{ width: '30px', height: '30px' }} />
          </button>

          <h2 style={{
            color: '#333',
            fontSize: '50px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            Создать новую задачу
          </h2>

          {error && (
            <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ fontSize: '32px', marginTop: '20px' }}>
              <label>Название:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
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

            <div style={{ fontSize: '32px', marginTop: '20px' }}>
              <label>Описание задачи:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
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
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
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

            {listLabel && (
              <div style={{ 
                fontSize: '32px', 
                marginTop: '20px', 
                backgroundColor: 'rgba(240, 240, 240, 0.7)', 
                padding: '10px', 
                borderRadius: '5px' 
              }}>
                <p>Задача будет добавлена в колонку: <span style={{ fontWeight: 'bold' }}>{listLabel}</span></p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '35px' }}>
              <button
                type="button"
                onClick={() => router.push(`/boards/${id}`)}
                style={{
                  backgroundColor: '#ddd',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '23px'
                }}
                disabled={isLoading}
              >
                Отмена
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '23px'
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Создание...' : 'Создать задачу'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
