"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <div>
            <h1>Вход в систему</h1>
            <button onClick={() => signIn("gitlab")}>Войти через GitLab</button>
        </div>
    );
}