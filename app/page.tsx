'use client'

import React, { useEffect, useState } from 'react';
import {signIn, useSession} from "next-auth/react";
import {redirect} from "next/navigation";

export default function Home() {
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);

  // Если пользователь уже авторизован, то мы переводим его с главной страницы на доски
  if (status === "authenticated") return redirect('/boards')

  useEffect(() => {
    setMounted(true);

    // Принудительно устанавливаем стили для body
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';

    return () => {
      // Очистка при размонтировании
      document.body.style.height = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="monomakh-regular"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: "url('/image.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <button
        onClick={() => signIn("gitlab")}
        className="monomakh-regular"
        style={{
          backgroundColor: 'rgba(102, 102, 102, 0.75)',
          color: 'white',
          fontWeight: 'bold',
          padding: '10px 32px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgb(134, 134, 134)',
          fontSize: '45px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: "pointer",
        }}
      >
        Авторизоваться через Гитлаб
        <img src="/gitlab-logo.png" alt="icon" style={{ width: '74px', height: '74px' }} />
      </button>
    </div>
  );
}