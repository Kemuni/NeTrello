'use client'
import React, { useState, useEffect } from 'react';

interface TaskCardProps {
    title: string;
    assignee: string;
    description: string;
    dueDate: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, assignee, description, dueDate }) => {
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {

        setTimeout(() => {
            setIsAnimating(false);
        }, 50);
    }, []);

    return (
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
            <img src="/packet.png" alt="packett" style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                right: '-20px',
                bottom: '-20px',
                width: 'calc(100% + 40px)',
                height: 'calc(100% + 40px)',
                zIndex: 1,
                borderRadius: '10px',
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
            }} />
            <div style={{
                position: 'relative',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #ccc',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 2,
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}>
            <h2 style={{ color: '#333', fontSize: '50px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>{title}</h2>
            <p style={{ fontSize: '32px', marginTop: '20px' }}>Задача закреплена за:
                <br />
                <input 
                    type="text" 
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
            <p style={{ fontSize: '32px', marginTop: '20px' }}>Описание задачи:
                <br />
                <input 
                    type="text" 
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
            <p style={{ fontSize: '32px', marginTop: '20px' }}>Срок выполнения:
                <input 
                    type="text" 
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
                <button style={{
                    backgroundColor: '#ddd',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontSize: '23px',
                    marginTop: '35px'
                }}>Отменить</button>
                <button style={{
                    backgroundColor: '#ddd',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontSize: '23px',
                    marginTop: '35px'
                }}>Добавить</button>
            </div>
        </div>
        </div>
    );
};

const Page: React.FC = () => {
    
    const taskData = {
        title: "Название задачи",
        assignee: "Сударь Дмитрий",
        description: "Организовать государственный переворот во имя батюшки Ленина!",
        dueDate: "01.01.1900"
    };

    return (
        <div style={{
            backgroundImage: "url('/background-manage.jpg')",
            backgroundSize: 'cover',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <TaskCard 
                title={taskData.title}
                assignee={taskData.assignee}
                description={taskData.description}
                dueDate={taskData.dueDate}
            />
        </div>
    );
};

export default Page;
