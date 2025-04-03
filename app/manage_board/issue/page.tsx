'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

interface TaskCardProps {
    title: string;
    assignee: string;
    description: string;
    dueDate: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, assignee, description, dueDate }) => {
    const router = useRouter();

    const handleComplete = () => {
        router.push('');
    };

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
                borderRadius: '10px'
            }} />
            <div style={{
                position: 'relative',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #ccc',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                zIndex: 2
            }}>
                <h2 style={{ color: '#333', fontSize: '50px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>{title}</h2>
                <p style={{ fontSize: '32px', marginTop: '20px' }}>Задача закреплена за:
                    <br />
                    <span style={{ color: '#773306'}}>{assignee}</span>
                </p>
                <p style={{ fontSize: '32px', marginTop: '20px' }}>Описание задачи:
                    <br />
                    <span style={{ color: '#773306'}}>{description}</span>
                </p>
                <p style={{ fontSize: '32px', marginTop: '20px' }}>Срок выполнения:
                    <span style={{ color: '#773306' }}>{dueDate}</span>
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
                    }}>Удалить</button>
                    <button style={{
                        backgroundColor: '#ddd',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '23px',
                        marginTop: '35px'
                    }}>Изменить</button>
                    <button onClick={handleComplete} style={{
                        backgroundColor: '#ddd',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '23px',
                        marginTop: '35px'
                    }}>Завершить</button>
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
