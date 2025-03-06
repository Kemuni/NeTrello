"use client";

import { useSession, signOut } from "next-auth/react";
import {useEffect, useState} from "react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRepositories = async (accessToken) => {
        setLoading(true);
        try {
            const response = await fetch("https://gitlab.com/api/v4/projects?membership=true", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = await response.json();
            console.log(data)
            setRepositories(data);
        } catch (error) {
            console.error("Ошибка при получении репозиториев:", error);
        } finally {
            setLoading(false);
        }
    };

    // Загружаем репозитории при загрузке страницы
    useEffect(() => {
        if (session?.accessToken) {
            fetchRepositories(session.accessToken);
        }
    }, [session]);

    if (status === "loading") {
        return <p>Загрузка...</p>;
    }

    if (!session) {
        return <p>Доступ запрещен. Пожалуйста, войдите в систему.</p>;
    }

    return (
        <div>
            <h1>Добро пожаловать, {session.user.name}!</h1>
            <p>Email: {session.user.email}</p>

            <h2>Ваши репозитории:</h2>
            {loading ? (
                <p>Загрузка репозиториев...</p>
            ) : (
                <ul>
                    {repositories.map((repo) => (
                        <li key={repo.id}>
                            <a href={repo.web_url} target="_blank" rel="noopener noreferrer">
                                {repo.name}
                            </a>
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => signOut()}>Выйти</button>
        </div>
    );
}