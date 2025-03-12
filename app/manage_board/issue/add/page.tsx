import React from 'react';

interface TaskCardProps {
    title: string;
    assignee: string;
    description: string;
    dueDate: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, assignee, description, dueDate }) => {
    return (
        <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            width: '60%',
            margin: '20px auto',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            fontFamily: 'Monomakh, sans-serif'
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
                <button style={{
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
    );
};

const Page: React.FC = () => {
    // Пример данных, которые вы можете получить из GitLab
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
